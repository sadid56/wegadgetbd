"use client";

import { useCallback, useMemo, useState } from "react";
import { endOfDay, startOfDay, subDays, subMonths } from "date-fns";
import { parseAsString } from "nuqs";

import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Button } from "@/components/ui/button";
import { InputBase } from "@/components/ui/input";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable } from "@/components/ui/data-table";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { AlertDialog } from "@/components/ui/alert-dialog";

import { useListQuery } from "@/hooks/use-list-query";
import { useDebounce } from "@/hooks/use-debounce";
import { formatBdt } from "@/lib/utils";
import { useSales, useDeleteSale } from "@/query-client/sales";
import { tokens } from "@/theme/theme";
import { SaleDialog } from "./_components/sale-dialog";
import { createSalesColumns } from "./_components/sales-columns";
import { SalesSummary } from "./_components/sales-summary";

const DATE_FILTER_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_12_months", label: "Last 12 Months" },
] as const;

function getDateRange(dateFilter: string): { startDate?: Date; endDate?: Date } {
  const now = new Date();
  switch (dateFilter) {
    case "today":
      return { startDate: startOfDay(now), endDate: endOfDay(now) };
    case "last_30_days":
      return { startDate: startOfDay(subDays(now, 30)) };
    case "last_12_months":
      return { startDate: startOfDay(subMonths(now, 12)) };
    default:
      return {};
  }
}

export interface AdminSaleItem {
  id: string;
  productName: string;
  customerName: string;
  phoneNumber?: string | null;
  address?: string | null;
  sellerName?: string | null;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  boostingCost: number;
  profit: number;
  status: string;
  date: Date;
}

export default function SalesPage() {
  const {
    search,
    page,
    rowsPerPage,
    seller: sellerParam,
    dateFilter,
    setSearch,
    setPage,
    setQuery,
  } = useListQuery({
    seller: parseAsString.withDefault("all"),
    dateFilter: parseAsString.withDefault("all"),
  });

  const debouncedSearch = useDebounce(search, 300);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<AdminSaleItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { startDate, endDate } = useMemo(() => getDateRange(dateFilter), [dateFilter]);

  const { data, isLoading } = useSales({
    page,
    limit: rowsPerPage,
    search: debouncedSearch.trim() || undefined,
    startDate,
    endDate,
    sellerName: sellerParam === "all" ? undefined : sellerParam,
  });

  const { mutate: deleteSale } = useDeleteSale();

  const handleDelete = () => {
    if (!deleteId) return;
    deleteSale(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  const handleEdit = useCallback((sale: AdminSaleItem) => {
    setSelectedSale(sale);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const sellerOptions = useMemo(() => data?.sellerOptions ?? [], [data?.sellerOptions]);
  const currentSellerLabel =
    sellerParam === "all" ? "All Sellers" : (sellerOptions.find((s: string) => s === sellerParam) ?? sellerParam);

  const sellerDropdownItems: (DropdownItem | "divider")[] = useMemo(() => {
    const allItem: DropdownItem = {
      label: "All Sellers",
      action: () => void setQuery({ seller: null, page: 1 }),
    };
    const sellerItems: DropdownItem[] = sellerOptions.map((s: string) => ({
      label: s,
      action: () => void setQuery({ seller: s, page: 1 }),
    }));
    return [allItem, "divider", ...sellerItems];
  }, [sellerOptions, setQuery]);

  const currentDateLabel =
    DATE_FILTER_OPTIONS.find((opt) => opt.value === dateFilter)?.label ?? "All Time";

  const dateDropdownItems: DropdownItem[] = useMemo(
    () =>
      DATE_FILTER_OPTIONS.map((opt) => ({
        label: opt.label,
        action: () => void setQuery({ dateFilter: opt.value === "all" ? null : opt.value, page: 1 }),
      })),
    [setQuery],
  );

  const columns = useMemo(
    () => createSalesColumns({ onEdit: handleEdit, onDelete: handleDeleteClick }),
    [handleEdit, handleDeleteClick],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
      <DashboardHeader
        title='Sales Report'
        description='Manage and view your sales performance and transactions.'
        sx={{
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
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", sm: "flex-end" } }}>
              <Box component='span' sx={{ fontSize: { xs: 11.5, sm: 12 }, fontWeight: 500, color: "text.secondary" }}>
                Total Profit
              </Box>
              <Box component='span' sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 700, color: tokens.successText }}>
                {formatBdt(data?.totalProfit ?? 0)}
              </Box>
            </Box>
            <Button
              variant='primary'
              size='sm'
              onClick={() => setIsAddDialogOpen(true)}
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add Sale
            </Button>
          </Box>
        }
      />

      <SalesSummary totals={data?.totals} productWise={data?.productWise} />

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: { sm: 1 }, minWidth: { sm: 240 }, maxWidth: { xs: "100%", sm: 384 } }}>
          <InputBase
            size='small'
            placeholder='Search product, customer, or phone...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Dropdown
            align='left'
            trigger={
              <Button
                variant='outline'
                size='sm'
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                sx={{ whiteSpace: "nowrap" }}
              >
                {currentSellerLabel}
              </Button>
            }
            items={sellerDropdownItems}
          />

          <Dropdown
            align='left'
            trigger={
              <Button
                variant='outline'
                size='sm'
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                sx={{ whiteSpace: "nowrap" }}
              >
                {currentDateLabel}
              </Button>
            }
            items={dateDropdownItems}
          />
        </Box>
      </Box>

      {/* Reusable DataTable with Backend Pagination */}
      <DataTable
        columns={columns}
        data={data?.sales ?? []}
        keyExtractor={(sale) => sale.id}
        isLoading={isLoading}
        emptyMessage='No sales found.'
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={data?.metadata?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
      />

      {/* Add Dialog */}
      <SaleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => setIsAddDialogOpen(false)}
      />

      {/* Edit Dialog */}
      {selectedSale && (
        <SaleDialog
          open
          initialData={{
            ...selectedSale,
            phoneNumber: selectedSale.phoneNumber ?? undefined,
            address: selectedSale.address ?? undefined,
            sellerName: selectedSale.sellerName ?? undefined,
          }}
          onOpenChange={(open) => {
            if (!open) setSelectedSale(null);
          }}
          onSuccess={() => setSelectedSale(null)}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title='Delete Sale Record?'
        description='This action will permanently delete this sale transaction. It cannot be undone.'
        confirmText='Delete'
        confirmVariant='destructive'
      />
    </Box>
  );
}
