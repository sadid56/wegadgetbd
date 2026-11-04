"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { InputBase } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { AlertDialog } from "@/components/ui/alert-dialog";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useSales, useDeleteSale } from "@/query-client/sales";
import { SaleDialog } from "./_components/sale-dialog";
import { tokens } from "@/theme/theme";

function SaleStatusChip({ status }: { status: string }) {
  if (status === "COMPLETED" || status === "DELIVERED") {
    return <Badge variant='success'>{status}</Badge>;
  }
  if (status === "RETURNED") {
    return <Badge variant='danger'>{status}</Badge>;
  }
  return <Badge variant='secondary'>{status}</Badge>;
}

const DATE_FILTER_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_12_months", label: "Last 12 Months" },
];

export default function SalesPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [sellerParam, setSellerParam] = useQueryState("seller", parseAsString.withDefault("all"));
  const [dateFilter, setDateFilter] = useQueryState("dateFilter", parseAsString.withDefault("all"));

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    if (dateFilter === "last_30_days") {
      const start = new Date();
      start.setDate(now.getDate() - 30);
      return { startDate: start, endDate: undefined };
    }
    if (dateFilter === "last_12_months") {
      const start = new Date();
      start.setMonth(now.getMonth() - 12);
      return { startDate: start, endDate: undefined };
    }
    if (dateFilter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    return { startDate: undefined, endDate: undefined };
  }, [dateFilter]);

  const { data, isLoading } = useSales({
    page,
    limit: 10,
    search: search.trim() || undefined,
    startDate,
    endDate,
    sellerName: sellerParam === "all" ? undefined : sellerParam,
  });

  const { mutate: deleteSale } = useDeleteSale();

  const handleDelete = () => {
    if (!deleteId) return;
    deleteSale(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
      },
    });
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(value);

  const totals = data?.totals ?? {
    totalSoldQuantity: 0,
    totalSellPrices: 0,
    cancelCount: 0,
    returnCount: 0,
  };

  const statCards = [
    { label: "Sold Qty", value: totals.totalSoldQuantity, color: "text.primary" },
    { label: "All Sell Prices", value: formatMoney(totals.totalSellPrices), color: "text.primary" },
    { label: "Cancel Count", value: totals.cancelCount, color: tokens.badgeSale },
    { label: "Return Count", value: totals.returnCount, color: tokens.danger },
  ];

  const productWise = data?.productWise ?? {
    today: [],
    last7Days: [],
    last30Days: [],
  };

  const productWiseCards = [
    { label: "Today", rows: productWise.today },
    { label: "Last 7 Days", rows: productWise.last7Days },
    { label: "Last 30 Days", rows: productWise.last30Days },
  ];

  const sellerOptions = data?.sellerOptions ?? [];
  const currentSellerLabel =
    sellerParam === "all" ? "All Sellers" : sellerOptions.find((s: string) => s === sellerParam) ?? sellerParam;

  const sellerDropdownItems: (DropdownItem | "divider")[] = useMemo(() => {
    const allItem: DropdownItem = {
      label: "All Sellers",
      action: () => {
        setSellerParam(null);
        setPage(1);
      },
    };
    const sellerItems: DropdownItem[] = sellerOptions.map((s: string) => ({
      label: s,
      action: () => {
        setSellerParam(s);
        setPage(1);
      },
    }));
    return [allItem, "divider", ...sellerItems];
  }, [sellerOptions, setSellerParam, setPage]);

  const currentDateLabel =
    DATE_FILTER_OPTIONS.find((opt) => opt.value === dateFilter)?.label ?? "All Time";

  const dateDropdownItems: DropdownItem[] = useMemo(
    () =>
      DATE_FILTER_OPTIONS.map((opt) => ({
        label: opt.label,
        action: () => {
          setDateFilter(opt.value === "all" ? null : opt.value);
          setPage(1);
        },
      })),
    [setDateFilter, setPage],
  );

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "date",
        header: "Date",
        width: 100,
        cell: (sale) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
            {format(new Date(sale.date), "dd/MM/yy")}
          </Box>
        ),
      },
      {
        id: "product",
        header: "Product",
        cell: (sale) => (
          <Box
            component='span'
            title={sale.productName}
            sx={{
              fontWeight: 500,
              color: "text.primary",
              maxWidth: 150,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {sale.productName}
          </Box>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        cell: (sale) => (
          <Box
            component='span'
            title={sale.customerName}
            sx={{
              color: "text.primary",
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {sale.customerName}
          </Box>
        ),
      },
      {
        id: "seller",
        header: "Seller",
        cell: (sale) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.primary" }}>
            {sale.sellerName || "—"}
          </Box>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        cell: (sale) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.primary" }}>
            {sale.phoneNumber || "—"}
          </Box>
        ),
      },
      {
        id: "quantity",
        header: "Qty",
        cell: (sale) => (
          <Box component='span' sx={{ fontWeight: 600, color: "text.primary" }}>
            {sale.quantity}
          </Box>
        ),
      },
      {
        id: "sellPrice",
        header: "S.Price",
        cell: (sale) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.primary" }}>
            ৳{Number(sale.sellPrice).toFixed(0)}
          </Box>
        ),
      },
      {
        id: "buyPrice",
        header: "B.Price",
        cell: (sale) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
            ৳{Number(sale.buyPrice).toFixed(0)}
          </Box>
        ),
      },
      {
        id: "boostingCost",
        header: "Boosting",
        cell: (sale) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
            ৳{Number(sale.boostingCost).toFixed(0)}
          </Box>
        ),
      },
      {
        id: "profit",
        header: "Profit",
        cell: (sale) => (
          <Box
            component='span'
            sx={{
              fontWeight: 700,
              color: sale.profit >= 0 ? tokens.successText : tokens.danger,
            }}
          >
            ৳{Number(sale.profit).toFixed(0)}
          </Box>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (sale) => <SaleStatusChip status={sale.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (sale) => (
          <Dropdown
            title='Actions'
            items={[
              {
                label: "Edit",
                icon: <EditOutlinedIcon sx={{ fontSize: 18 }} />,
                action: () => {
                  setSelectedSale(sale);
                  setIsEditDialogOpen(true);
                },
              },
              "divider",
              {
                label: "Delete",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => setDeleteId(sale.id),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title='Sales Report'
        description='Manage and view your sales performance and transactions.'
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Box component='span' sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary" }}>
                Total Profit
              </Box>
              <Box component='span' sx={{ fontSize: 20, fontWeight: 700, color: tokens.successText }}>
                {formatMoney(data?.totalProfit ?? 0)}
              </Box>
            </Box>
            <Button
              variant='primary'
              onClick={() => setIsAddDialogOpen(true)}
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            >
              Add Sale
            </Button>
          </Box>
        }
      />

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {statCards.map((card) => (
          <Card key={card.label}>
            <Box
              component='p'
              sx={{
                fontSize: 12,
                color: "text.secondary",
                textTransform: "uppercase",
                m: 0,
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {card.label}
            </Box>
            <Box
              component='p'
              sx={{
                fontSize: 22,
                fontWeight: 800,
                color: card.color,
                m: 0,
                mt: 0.5,
                lineHeight: 1.2,
              }}
            >
              {card.value}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Product-wise Summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {productWiseCards.map((item) => (
          <Card key={item.label}>
            <Typography component='h3' sx={{ fontSize: 14, fontWeight: 700, mb: 1.5, color: "text.primary" }}>
              {item.label}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 208,
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {item.rows.length === 0 ? (
                <Box component='p' sx={{ fontSize: 12, color: "text.secondary", m: 0 }}>
                  No product sales
                </Box>
              ) : (
                item.rows.slice(0, 8).map((row: any) => (
                  <Box
                    key={`${item.label}-${row.productName}`}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}
                  >
                    <Box
                      component='span'
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mr: 1,
                        color: "text.primary",
                      }}
                    >
                      {row.productName}
                    </Box>
                    <Box component='span' sx={{ fontWeight: 600, color: "text.primary", flexShrink: 0 }}>
                      {row.soldQty} pcs
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Filters Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 240, maxWidth: 384 }}>
          <InputBase
            placeholder='Search product, customer, or phone...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value || null);
              setPage(1);
            }}
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          />
        </Box>

        <Dropdown
          align='left'
          trigger={
            <Button
              variant='outline'
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
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
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
            >
              {currentDateLabel}
            </Button>
          }
          items={dateDropdownItems}
        />
      </Box>

      {/* Reusable DataTable with Backend Pagination */}
      <DataTable
        columns={columns}
        data={data?.sales ?? []}
        keyExtractor={(sale) => sale.id}
        isLoading={isLoading}
        emptyMessage='No sales found.'
        page={page - 1}
        rowsPerPage={10}
        totalCount={data?.metadata?.total ?? 0}
        onPageChange={(_, newPage) => {
          setPage(newPage + 1);
        }}
      />

      {/* Add Dialog */}
      <SaleDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => setIsAddDialogOpen(open)}
        onSuccess={() => {
          setIsAddDialogOpen(false);
        }}
      />

      {/* Edit Dialog */}
      {selectedSale && (
        <SaleDialog
          open={isEditDialogOpen}
          initialData={selectedSale}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedSale(null);
          }}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            setSelectedSale(null);
          }}
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
