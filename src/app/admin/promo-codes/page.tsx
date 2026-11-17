"use client";

import { useMemo, useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase, TextField } from "@/components/ui/input";
import { Select, MenuItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/context/toast-context";
import { tokens } from "@/theme/theme";

import {
  useAdminPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
  type PromoCodeItem,
} from "@/query-client/promo-codes";

interface PromoFormState {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  maxDiscountAmount: string;
  minOrderAmount: string;
  usageLimit: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

const DEFAULT_FORM: PromoFormState = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderAmount: "0",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

function toLocalDatetimeInput(val: Date | string | null | undefined): string {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getPromoStatus(promo: PromoCodeItem): { label: string; variant: "success" | "secondary" | "destructive" | "outline" } {
  const now = new Date();
  if (!promo.isActive) return { label: "INACTIVE", variant: "outline" };
  if (promo.expiresAt && new Date(promo.expiresAt) < now) return { label: "EXPIRED", variant: "destructive" };
  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) return { label: "LIMIT REACHED", variant: "destructive" };
  if (promo.startsAt && new Date(promo.startsAt) > now) return { label: "SCHEDULED", variant: "secondary" };
  return { label: "ACTIVE", variant: "success" };
}

export default function AdminPromoCodesPage() {
  const toast = useToast();
  const [search, setSearch] = useQueryState("search", { defaultValue: "", shallow: false });
  const [statusFilter, setStatusFilter] = useQueryState("status", { defaultValue: "all", shallow: false });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rowsPerPage, setRowsPerPage] = useQueryState("limit", parseAsInteger.withDefault(10));

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
  const [form, setForm] = useState<PromoFormState>(DEFAULT_FORM);
  const [deleteTarget, setDeleteTarget] = useState<PromoCodeItem | null>(null);

  const promoCodes = data?.promoCodes ?? [];
  const total = data?.total ?? 0;

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  const openCreateModal = () => {
    setEditingPromo(null);
    setForm(DEFAULT_FORM);
    setModalOpen(true);
  };

  const openEditModal = (promo: PromoCodeItem) => {
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      description: promo.description || "",
      discountType: promo.discountType,
      discountValue: String(promo.discountValue),
      maxDiscountAmount: promo.maxDiscountAmount != null ? String(promo.maxDiscountAmount) : "",
      minOrderAmount: String(promo.minOrderAmount ?? 0),
      usageLimit: promo.usageLimit != null ? String(promo.usageLimit) : "",
      startsAt: toLocalDatetimeInput(promo.startsAt),
      expiresAt: toLocalDatetimeInput(promo.expiresAt),
      isActive: promo.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const code = form.code.trim().toUpperCase();
    const discountValue = Number(form.discountValue);
    const minOrderAmount = Number(form.minOrderAmount || 0);
    const maxDiscountAmount = form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null;
    const usageLimit = form.usageLimit ? parseInt(form.usageLimit, 10) : null;

    if (code.length < 2) {
      toast.error("Promo code must be at least 2 characters.");
      return;
    }
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      toast.error("Discount value must be greater than 0.");
      return;
    }
    if (form.discountType === "PERCENTAGE" && discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%.");
      return;
    }

    const payload = {
      code,
      description: form.description.trim() || null,
      discountType: form.discountType,
      discountValue,
      maxDiscountAmount: form.discountType === "PERCENTAGE" ? maxDiscountAmount : null,
      minOrderAmount: Number.isFinite(minOrderAmount) && minOrderAmount >= 0 ? minOrderAmount : 0,
      usageLimit: usageLimit && usageLimit > 0 ? usageLimit : null,
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      isActive: form.isActive,
    };

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
      cell: (row) => (
        <Box sx={{ fontSize: "0.78rem", color: tokens.textSecondary, lineHeight: 1.5 }}>
          {row.startsAt && <Box>From: {dateFormatter.format(new Date(row.startsAt))}</Box>}
          <Box sx={{ color: row.expiresAt && new Date(row.expiresAt) < new Date() ? tokens.danger : tokens.textSecondary }}>
            {row.expiresAt ? `Exp: ${dateFormatter.format(new Date(row.expiresAt))}` : "No expiry"}
          </Box>
        </Box>
      ),
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
              size="small"
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
            size="small"
            onClick={() => openEditModal(row)}
            title="Edit promo code"
            sx={{ color: tokens.textSecondary, "&:hover": { color: tokens.primary } }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setDeleteTarget(row)}
            title="Delete promo code"
            sx={{ color: tokens.textSecondary, "&:hover": { color: tokens.danger } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const isSaving = createPromo.isPending || updatePromo.isPending;

  return (
    <Box>
      <DashboardHeader
        title="Promo Codes"
        subtitle="Create, edit, and manage discount coupons with expiry dates and usage limits"
        action={
          <Button variant="primary" startIcon={<AddIcon />} onClick={openCreateModal}>
            New Promo Code
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <Box sx={{ mb: 2.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
        <InputBase
          size="small"
          placeholder="Search promo code or description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          startIcon={<SearchIcon sx={{ fontSize: 18, color: tokens.textSecondary }} />}
          sx={{ width: { xs: "100%", sm: 320 } }}
        />

        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(String(e.target.value));
            setPage(1);
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <DataTable
        columns={columns}
        data={promoCodes}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No promo codes found. Create your first promo code!"
        pagination
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={total}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
      />

      {/* Create / Edit Promo Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => !isSaving && setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: `${tokens.radiusXxl}px`,
              bgcolor: tokens.bgPanel,
              backgroundImage: "none",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 18, pb: 1 }}>
          {editingPromo ? `Edit Promo Code (${editingPromo.code})` : "Create Promo Code"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Promo Code *"
              placeholder="e.g. EID20"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              fullWidth
            />
            <TextField
              select
              label="Discount Type *"
              value={form.discountType}
              onChange={(e) =>
                setForm((f) => ({ ...f, discountType: e.target.value as "PERCENTAGE" | "FIXED" }))
              }
              fullWidth
            >
              <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
              <MenuItem value="FIXED">Fixed Amount (৳)</MenuItem>
            </TextField>
          </Box>

          <TextField
            label="Description (Optional)"
            placeholder="e.g. Eid Special 20% discount on all gadgets"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
          />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label={form.discountType === "PERCENTAGE" ? "Discount Percentage (%) *" : "Discount Amount (৳) *"}
              type="number"
              placeholder={form.discountType === "PERCENTAGE" ? "20" : "200"}
              value={form.discountValue}
              onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
              fullWidth
            />

            {form.discountType === "PERCENTAGE" ? (
              <TextField
                label="Max Discount Cap (৳)"
                type="number"
                placeholder="500 (optional)"
                value={form.maxDiscountAmount}
                onChange={(e) => setForm((f) => ({ ...f, maxDiscountAmount: e.target.value }))}
                fullWidth
              />
            ) : (
              <TextField
                label="Min Order Amount (৳)"
                type="number"
                placeholder="0"
                value={form.minOrderAmount}
                onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                fullWidth
              />
            )}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            {form.discountType === "PERCENTAGE" && (
              <TextField
                label="Min Order Amount (৳)"
                type="number"
                placeholder="0"
                value={form.minOrderAmount}
                onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                fullWidth
              />
            )}
            <TextField
              label="Usage Limit (Optional)"
              type="number"
              placeholder="Leave blank for unlimited"
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Starts At (Optional)"
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Expires At (Optional)"
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 0.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
              }
              label={
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: tokens.textPrimary }}>
                  Active (usable by customers)
                </Typography>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5, gap: 1 }}>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            {editingPromo ? "Save Changes" : "Create Promo Code"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deletePromo.isPending}
        title={`Delete promo code "${deleteTarget?.code}"?`}
        description="Are you sure you want to permanently delete this promo code? Customers will no longer be able to apply it."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </Box>
  );
}
