"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { parseAsStringLiteral } from "nuqs";
import { useListQuery } from "@/hooks/use-list-query";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { Button, InputBase, Badge, Avatar, Select, MenuItem, DataTable, type DataTableColumn, AlertDialog } from "@/components/ui";
import { DashboardHeader } from "@/components/admin/dashboard-header";

import SearchIcon from "@mui/icons-material/Search";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useTrash, useRestoreTrash, usePermanentDeleteTrash } from "@/query-client/admin";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";
import type { TrashItem, TrashItemType } from "@/server/schemas/admin.schema";

const TYPE_CONFIG: Record<
  TrashItemType,
  { label: string; variant: "info" | "secondary" | "warning" | "success" }
> = {
  PRODUCT: { label: "Product", variant: "info" },
  CATEGORY: { label: "Category", variant: "secondary" },
  REVIEW: { label: "Review", variant: "warning" },
  ORDER: { label: "Order", variant: "success" },
};

const TRASH_TYPES = ["ALL", "PRODUCT", "CATEGORY", "REVIEW", "ORDER"] as const;

export default function TrashPage() {
  const {
    search,
    page,
    rowsPerPage,
    type: selectedType,
    setSearch,
    setPage,
    setRowsPerPage,
    setQuery,
  } = useListQuery({
    type: parseAsStringLiteral(TRASH_TYPES).withDefault("ALL").withOptions({ shallow: false }),
  });

  const [itemToRestore, setItemToRestore] = useState<TrashItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TrashItem | null>(null);

  const { data, isLoading } = useTrash({
    page,
    limit: rowsPerPage,
    type: selectedType === "ALL" ? undefined : selectedType,
    search: search.trim() || undefined,
  });

  const { mutate: restoreItem, isPending: isRestoring } = useRestoreTrash();
  const { mutate: permanentDelete, isPending: isDeleting } = usePermanentDeleteTrash();

  const handleConfirmRestore = () => {
    if (!itemToRestore) return;
    restoreItem({ id: itemToRestore.id, itemType: itemToRestore.itemType }, { onSuccess: () => setItemToRestore(null) });
  };

  const handleConfirmPermanentDelete = () => {
    if (!itemToDelete) return;
    permanentDelete({ id: itemToDelete.id, itemType: itemToDelete.itemType }, { onSuccess: () => setItemToDelete(null) });
  };

  const columns: DataTableColumn<TrashItem>[] = useMemo(
    () => [
      {
        id: "type",
        header: "Collection",
        cell: (item) => {
          const cfg = TYPE_CONFIG[item.itemType] || { label: item.itemType, variant: "secondary" };
          return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
      },
      {
        id: "item",
        header: "Item Details",
        cell: (item) => {
          const imageUrl = item.image ? getAssetUrl(item.image) : null;
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 240 }}>
              {imageUrl ? (
                <Avatar
                  src={imageUrl}
                  alt={item.title}
                  variant="rounded"
                  sx={{ width: 42, height: 42, bgcolor: "action.hover", flexShrink: 0 }}
                />
              ) : (
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 1.5,
                    bgcolor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 320,
                  }}
                  title={item.title}
                >
                  {item.title}
                </Typography>
                {item.subtitle && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 320,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        id: "deletedAt",
        header: "Deleted At",
        cell: (item) => (
          <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
            {item.deletedAt ? format(new Date(item.deletedAt), "MMM d, yyyy h:mm a") : "—"}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (item) => (
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
            <Button
              size="small"
              variant="outline"
              startIcon={<RestoreFromTrashOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => {
                e.stopPropagation();
                setItemToRestore(item);
              }}
              sx={{
                fontSize: "0.75rem",
                py: 0.5,
                px: 1.25,
                color: "primary.main",
                borderColor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "#fff",
                },
              }}
            >
              Restore
            </Button>
            <Button
              size="small"
              variant="outline"
              startIcon={<DeleteForeverOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => {
                e.stopPropagation();
                setItemToDelete(item);
              }}
              sx={{
                fontSize: "0.75rem",
                py: 0.5,
                px: 1.25,
                color: tokens.danger,
                borderColor: tokens.danger,
                "&:hover": {
                  bgcolor: tokens.danger,
                  color: "#fff",
                  borderColor: tokens.danger,
                },
              }}
            >
              Permanent Delete
            </Button>
          </Stack>
        ),
      },
    ],
    [],
  );

  const filterTabs = [
    { type: "ALL", label: "All Items", count: data?.counts?.ALL ?? 0 },
    { type: "PRODUCT", label: "Products", count: data?.counts?.PRODUCT ?? 0 },
    { type: "CATEGORY", label: "Categories", count: data?.counts?.CATEGORY ?? 0 },
    { type: "REVIEW", label: "Reviews", count: data?.counts?.REVIEW ?? 0 },
    { type: "ORDER", label: "Orders", count: data?.counts?.ORDER ?? 0 },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title='Trash & Recycle Bin'
        description='Soft-deleted products, categories, reviews, and orders are held here. Restore them back to active state or permanently remove them along with their storage files.'
      />

      {/* Search & Filter Dropdown Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: { sm: 384 } }}>
          <InputBase
            size='small'
            placeholder='Search deleted items...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value || null);
              setPage(1);
            }}
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          />
        </Box>

        <Select
          size='small'
          value={selectedType}
          onChange={(e) => {
            setQuery({
              type: String(e.target.value) as TrashItemType | "ALL",
              page: 1,
            });
          }}
          sx={{
            minWidth: { xs: 135, sm: 165 },
            flexShrink: 0,
          }}
        >
          {filterTabs.map((tab) => (
            <MenuItem key={tab.type} value={tab.type}>
              {tab.label} ({tab.count})
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Trash Data Table */}
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        totalCount={data?.total ?? 0}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
        emptyMessage='Trash is empty. No deleted items found.'
      />

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={!!itemToRestore}
        onClose={() => !isRestoring && setItemToRestore(null)}
        onConfirm={handleConfirmRestore}
        loading={isRestoring}
        title={`Restore ${itemToRestore ? TYPE_CONFIG[itemToRestore.itemType]?.label : "Item"}?`}
        description={
          itemToRestore ? `Are you sure you want to restore "${itemToRestore.title}"? It will become active again in its collection.` : ""
        }
        confirmText='Restore Item'
        confirmVariant='default'
      />

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog
        open={!!itemToDelete}
        onClose={() => !isDeleting && setItemToDelete(null)}
        onConfirm={handleConfirmPermanentDelete}
        loading={isDeleting}
        title='Permanently Delete Item?'
        description={
          itemToDelete
            ? `WARNING: This will PERMANENTLY remove "${itemToDelete.title}" from the database AND delete any associated files/images from Supabase Storage. This action CANNOT be undone.`
            : ""
        }
        confirmText='Yes, Permanently Delete'
        confirmVariant='destructive'
      />
    </Box>
  );
}
