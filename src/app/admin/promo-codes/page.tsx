"use client";

import { useState } from "react";
import { format, isFuture, isPast } from "date-fns";
import { parseAsString } from "nuqs";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { Select, MenuItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useListQuery } from "@/hooks/use-list-query";
import { tokens } from "@/theme/theme";

import {
  useAdminPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
  type PromoCodeItem,
} from "@/query-client/promo-codes";
import { PromoCodeModal, type PromoCodePayload } from "./_components/promo-code-modal";

function getPromoStatus(promo: PromoCodeItem): { label: string; variant: "success" | "secondary" | "destructive" | "outline" } {
  if (!promo.isActive) return { label: "INACTIVE", variant: "outline" };
  if (promo.expiresAt && isPast(new Date(promo.expiresAt))) return { label: "EXPIRED", variant: "destructive" };
  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) return { label: "LIMIT REACHED", variant: "destructive" };
  if (promo.startsAt && isFuture(new Date(promo.startsAt))) return { label: "SCHEDULED", variant: "secondary" };
  return { label: "ACTIVE", variant: "success" };
}

export default function AdminPromoCodesPage() {
  const {
    search,
    page,
    rowsPerPage,
    status: statusFilter,
    setSearch,
    setPage,
    setRowsPerPage,
    setQuery,
  } = useListQuery({
    status: parseAsString.withDefault("all").withOptions({ shallow: false }),
  });

  const { data, isLoading } = useAdminPromoCodes({
    search: search.trim() || undefined,
    status: (statusFilter as "all" | "active" | "inactive" | "expired") || "all",
    page,
    limit: rowsPerPage,
  });

  const createPromo = useCreatePromoCode();
  const updatePromo = useUpdatePromoCode();
  const deletePromo = useDeletePromoCode();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCodeItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromoCodeItem | null>(null);

  const promoCodes = data?.promoCodes ?? [];
  const total = data?.total ?? 0;
  const isSaving = createPromo.isPending || updatePromo.isPending;

  const openCreateModal = () => {
    setEditingPromo(null);
    setModalOpen(true);
  };

  const openEditModal = (promo: PromoCodeItem) => {
    setEditingPromo(promo);
    setModalOpen(true);
  };

  const handleSave = async (payload: PromoCodePayload) => {
    if (editingPromo) {
      await updatePromo.mutateAsync({ id: editingPromo.id, ...payload });
    } else {
      await createPromo.mutateAsync(payload);
    }
    setModalOpen(false);
  };

  const handleToggleActive = async (promo: PromoCodeItem) => {
    await updatePromo.mutateAsync({
      id: promo.id,
      isActive: !promo.isActive,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deletePromo.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns: DataTableColumn<PromoCodeItem>[] = [
    {
      id: "code",
      header: "Promo Code",
      minWidth: 200,
      cell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: `${tokens.radiusMd}px`,
              bgcolor: tokens.primarySubtle,
              color: tokens.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 17 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: tokens.textPrimary,
                fontFamily: "monospace",
                letterSpacing: "0.04em",
              }}
            >
              {row.code}
            </Box>
            {row.description && (
              <Box
                sx={{
                  fontSize: "0.75rem",
                  color: tokens.textSecondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 220,
                }}
              >
                {row.description}
              </Box>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: "discount",
      header: "Discount",
      minWidth: 150,
      cell: (row) => (
        <Box>
          <Box sx={{ fontWeight: 700, fontSize: "0.875rem", color: tokens.primary }}>
            {row.discountType === "PERCENTAGE"
              ? `${row.discountValue}% OFF`
              : `৳${row.discountValue.toLocaleString()} OFF`}
          </Box>
          {row.discountType === "PERCENTAGE" && row.maxDiscountAmount != null && (
            <Box sx={{ fontSize: "0.72rem", color: tokens.textSecondary }}>
              Max ৳{row.maxDiscountAmount.toLocaleString()}
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: "minOrder",
      header: "Min Order",
      minWidth: 110,
      cell: (row) => (
        <Box sx={{ fontSize: "0.85rem", color: tokens.textPrimary, fontWeight: 500 }}>
          {row.minOrderAmount > 0 ? `৳${row.minOrderAmount.toLocaleString()}` : "None"}
        </Box>
      ),
    },
    {
      id: "usage",
      header: "Usage",
      minWidth: 110,
      cell: (row) => (
        <Box sx={{ fontSize: "0.85rem", color: tokens.textPrimary, fontWeight: 600 }}>
          {row.usedCount} / {row.usageLimit != null ? row.usageLimit : "∞"}
        </Box>
      ),
    },
    {
      id: "validity",
      header: "Expiry / Validity",
      minWidth: 190,
      cell: (row) => {
        const isExpired = Boolean(row.expiresAt && isPast(new Date(row.expiresAt)));
        return (
          <Box sx={{ fontSize: "0.78rem", color: tokens.textSecondary, lineHeight: 1.5 }}>
            {row.startsAt && <Box>From: {format(new Date(row.startsAt), "MMM d, yyyy, hh:mm a")}</Box>}
            <Box sx={{ color: isExpired ? tokens.danger : tokens.textSecondary }}>
              {row.expiresAt ? `Exp: ${format(new Date(row.expiresAt), "MMM d, yyyy, hh:mm a")}` : "No expiry"}
            </Box>
          </Box>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      minWidth: 130,
      cell: (row) => {
        const status = getPromoStatus(row);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Badge variant={status.variant}>{status.label}</Badge>
            <Switch
              size='small'
              checked={row.isActive}
              onChange={() => handleToggleActive(row)}
              disabled={updatePromo.isPending}
            />
          </Box>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      minWidth: 100,
      cell: (row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <IconButton
            size='small'
            onClick={() => openEditModal(row)}
            title='Edit promo code'
            sx={{ color: tokens.textSecondary, "&:hover": { color: tokens.primary } }}
          >
            <EditOutlinedIcon fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => setDeleteTarget(row)}
            title='Delete promo code'
            sx={{ color: tokens.textSecondary, "&:hover": { color: tokens.danger } }}
          >
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        </Box>
      ),
    },
  ];

  const renderStatusSelect = () => (
    <Select
      size='small'
      value={statusFilter}
      onChange={(e) => {
        setQuery({ status: String(e.target.value), page: 1 });
      }}
      sx={{ minWidth: { xs: 135, sm: 150 } }}
    >
      <MenuItem value='all'>All Status</MenuItem>
      <MenuItem value='active'>Active</MenuItem>
      <MenuItem value='inactive'>Inactive</MenuItem>
      <MenuItem value='expired'>Expired</MenuItem>
    </Select>
  );

  return (
    <Box>
      <DashboardHeader
        title='Promo Codes'
        subtitle='Create, edit, and manage discount coupons with expiry dates and usage limits'
        sx={{
          mb: 2.5,
          "& > div:last-of-type": {
            width: { xs: "100%", sm: "auto" },
          },
        }}
        action={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
              gap: 1.5,
            }}
          >
            <Box sx={{ display: { xs: "block", sm: "none" } }}>{renderStatusSelect()}</Box>
            <Button
              variant='primary'
              size='sm'
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={openCreateModal}
              sx={{ whiteSpace: "nowrap" }}
            >
              New Promo Code
            </Button>
          </Box>
        }
      />

      {/* Search & Filter Bar */}
      <Box sx={{ mb: 2.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
        <InputBase
          size='small'
          placeholder='Search promo code or description...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<SearchIcon sx={{ fontSize: 18, color: tokens.textSecondary }} />}
          sx={{ width: { xs: "100%", sm: 320 } }}
        />

        <Box sx={{ display: { xs: "none", sm: "block" } }}>{renderStatusSelect()}</Box>
      </Box>

      {/* Table */}
      <DataTable
        columns={columns}
        data={promoCodes}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage='No promo codes found. Create your first promo code!'
        pagination
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={total}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* Create / Edit Promo Modal */}
      <PromoCodeModal
        open={modalOpen}
        editingPromo={editingPromo}
        isSaving={isSaving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deletePromo.isPending}
        title={`Delete promo code "${deleteTarget?.code}"?`}
        description='Are you sure you want to permanently delete this promo code? Customers will no longer be able to apply it.'
        confirmText='Delete'
        cancelText='Cancel'
        confirmVariant='destructive'
      />
    </Box>
  );
}
