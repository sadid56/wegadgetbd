"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { Chip } from "@/components/ui/badge";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";

import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { SaleEndpoints } from "@/query-client/sales";
import { SaleDialog } from "./_components/sale-dialog";
import { tokens } from "@/theme/theme";

const tableHeadSx = {
  fontSize: 12,
  fontWeight: 600,
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  bgcolor: "action.hover",
  borderBottom: "1px solid",
  borderColor: "divider",
  py: 1.25,
  whiteSpace: "nowrap",
} as const;

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: 14,
  borderRadius: "8px",
  height: 40,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  boxShadow: "none",
  "&:hover": { bgcolor: "primary.dark", boxShadow: "none" },
} as const;

const cardSx = {
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  p: 1.5,
} as const;

function SaleStatusChip({ status }: { status: string }) {
  if (status === "COMPLETED" || status === "DELIVERED") {
    return (
      <Chip
        label={status}
        size='small'
        variant='outlined'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: tokens.successSubtle,
          color: tokens.successText,
          borderColor: tokens.successBorder,
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  if (status === "RETURNED") {
    return (
      <Chip
        label={status}
        size='small'
        variant='outlined'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: tokens.dangerSubtle,
          color: tokens.dangerHover,
          borderColor: tokens.dangerBorder,
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  return (
    <Chip
      label={status}
      size='small'
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 700,
        bgcolor: "action.hover",
        color: "text.primary",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  width: number;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <>
      <Box
        component='button'
        type='button'
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          height: 40,
          width,
          px: 1.75,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          fontSize: 13,
          fontWeight: 500,
          color: "text.primary",
          cursor: "pointer",
          textAlign: "left",
          "&:hover": { borderColor: "text.disabled" },
        }}
      >
        <Box component='span' sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {current.label}
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 18,
            color: "text.secondary",
            transition: "transform 200ms",
            transform: anchor ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: width,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              py: 0.5,
              maxHeight: 320,
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setAnchor(null);
            }}
            selected={opt.value === value}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function SalesPage() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sellerParam = searchParams.get("seller") || "all";

  const [sales, setSales] = useState<any[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sellerOptions, setSellerOptions] = useState<string[]>([]);
  const [totals, setTotals] = useState({
    totalSoldQuantity: 0,
    totalSellPrices: 0,
    cancelCount: 0,
    returnCount: 0,
  });
  const [productWise, setProductWise] = useState<{
    today: any[];
    last7Days: any[];
    last30Days: any[];
  }>({
    today: [],
    last7Days: [],
    last30Days: [],
  });

  const [dateFilter, setDateFilter] = useState("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      const now = new Date();
      if (dateFilter === "last_30_days") {
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
      } else if (dateFilter === "last_12_months") {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 12);
      } else if (dateFilter === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        startDate = start;
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        endDate = end;
      }

      try {
        const result = await SaleEndpoints.getSales({
          page,
          search,
          startDate,
          endDate,
          sellerName: sellerParam,
        });

        if (result) {
          setSales(result.sales);
          setTotalProfit(result.totalProfit);
          setTotalPages(result.metadata.totalPages);
          setSellerOptions(result.sellerOptions);
          setTotals(result.totals);
          setProductWise(result.productWise);
        }
      } catch (err) {
        console.error("Failed to load sales:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, search, dateFilter, refreshKey, sellerParam]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await SaleEndpoints.deleteSale(deleteId);
      if (res?.success) {
        toast.success("Sale deleted successfully");
        setDeleteId(null);
        handleRefresh();
      } else {
        toast.error("Failed to delete sale");
      }
    } catch {
      toast.error("Failed to delete sale");
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    router.push(`?page=1&search=${encodeURIComponent(query)}&seller=${encodeURIComponent(sellerParam)}`);
  };

  const handleSellerChange = (value: string) => {
    router.push(`?page=1&search=${encodeURIComponent(search)}&seller=${encodeURIComponent(value)}`);
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(value);

  const sellerFilterOptions = [{ value: "all", label: "All Sellers" }, ...sellerOptions.map((s) => ({ value: s, label: s }))];

  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "last_12_months", label: "Last 12 Months" },
  ];

  const statCards = [
    { label: "Sold Qty", value: totals.totalSoldQuantity, color: "text.primary" },
    { label: "All Sell Prices", value: formatMoney(totals.totalSellPrices), color: "text.primary" },
    { label: "Cancel Count", value: totals.cancelCount, color: tokens.badgeSale },
    { label: "Return Count", value: totals.returnCount, color: tokens.danger },
  ];

  const productWiseCards = [
    { label: "Today", rows: productWise.today },
    { label: "Last 7 Days", rows: productWise.last7Days },
    { label: "Last 30 Days", rows: productWise.last30Days },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            component='h1'
            sx={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Sales Report
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Manage and view your sales performance</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Box component='span' sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>
              Total Profit
            </Box>
            <Box component='span' sx={{ fontSize: 24, fontWeight: 700, color: tokens.successText, lineHeight: 1.2 }}>
              {formatMoney(totalProfit)}
            </Box>
          </Box>
          <Button variant='contained' disableElevation onClick={() => setIsAddDialogOpen(true)} sx={primaryButtonSx}>
            Add Sale
          </Button>
        </Box>
      </Box>

      {/* Stat cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {statCards.map((card) => (
          <Box key={card.label} sx={cardSx}>
            <Box
              component='p'
              sx={{
                fontSize: 12,
                color: "text.secondary",
                textTransform: "uppercase",
                m: 0,
                letterSpacing: "0.05em",
              }}
            >
              {card.label}
            </Box>
            <Box
              component='p'
              sx={{
                fontSize: 20,
                fontWeight: 900,
                color: card.color,
                m: 0,
                mt: 0.5,
                lineHeight: 1.2,
              }}
            >
              {card.value}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Product-wise summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {productWiseCards.map((item) => (
          <Box key={item.label} sx={{ ...cardSx, p: 2 }}>
            <Typography component='h3' sx={{ fontSize: 15, fontWeight: 900, mb: 1.5, color: "text.primary" }}>
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
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14 }}
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
                    <Box component='span' sx={{ fontWeight: 700, color: "text.primary", flexShrink: 0 }}>
                      {row.soldQty} pcs
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ position: "relative", flex: 1, minWidth: 240, maxWidth: 384 }}>
          <SearchIcon
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "text.secondary",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <Box component='form' onSubmit={handleSearch} sx={{ display: "flex" }}>
            <InputBase
              name='search'
              placeholder='Search by product, customer, or phone...'
              defaultValue={search}
              sx={{
                width: "100%",
                height: 40,
                pl: "32px",
                pr: 1.5,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                fontSize: 14,
                transition: "border-color 200ms",
                "& input::placeholder": { color: "text.secondary", opacity: 1 },
                "&.Mui-focused": { borderColor: "primary.main" },
              }}
            />
          </Box>
        </Box>

        <FilterSelect value={sellerParam} onChange={handleSellerChange} options={sellerFilterOptions} width={200} />

        <FilterSelect value={dateFilter} onChange={setDateFilter} options={dateFilterOptions} width={180} />
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...tableHeadSx, width: 100 }}>Date</TableCell>
              <TableCell sx={tableHeadSx}>Product</TableCell>
              <TableCell sx={tableHeadSx}>Customer</TableCell>
              <TableCell sx={tableHeadSx}>Seller</TableCell>
              <TableCell sx={tableHeadSx}>Phone</TableCell>
              <TableCell sx={tableHeadSx}>Qty</TableCell>
              <TableCell sx={tableHeadSx}>S.Price</TableCell>
              <TableCell sx={tableHeadSx}>B.Price</TableCell>
              <TableCell sx={tableHeadSx}>Boosting</TableCell>
              <TableCell sx={tableHeadSx}>Profit</TableCell>
              <TableCell sx={tableHeadSx}>Status</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No sales found.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow
                  key={sale.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": { borderBottom: "1px solid", borderColor: "divider", py: 1.5 },
                  }}
                >
                  <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>{format(new Date(sale.date), "dd/MM/yy")}</TableCell>
                  <TableCell
                    title={sale.productName}
                    sx={{
                      fontWeight: 500,
                      color: "text.primary",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sale.productName}
                  </TableCell>
                  <TableCell
                    title={sale.customerName}
                    sx={{
                      color: "text.primary",
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sale.customerName}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{sale.sellerName || "-"}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{sale.phoneNumber || "-"}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{sale.quantity}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{Number(sale.sellPrice).toFixed(0)}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{Number(sale.buyPrice).toFixed(0)}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{Number(sale.boostingCost).toFixed(0)}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: sale.profit >= 0 ? tokens.successText : tokens.danger,
                    }}
                  >
                    {Number(sale.profit).toFixed(0)}
                  </TableCell>
                  <TableCell>
                    <SaleStatusChip status={sale.status} />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <IconButton
                        size='small'
                        onClick={() => {
                          setSelectedSale(sale);
                          setIsEditDialogOpen(true);
                        }}
                        aria-label='Edit sale'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "text.secondary",
                          "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                        }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => setDeleteId(sale.id)}
                        aria-label='Delete sale'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "error.main",
                          "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p = 1) => router.push(`?page=${p}&search=${encodeURIComponent(search)}&seller=${encodeURIComponent(sellerParam)}`)}
            showFirstButton
            showLastButton
            siblingCount={1}
            shape='rounded'
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: 13,
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "divider",
                color: "text.primary",
                minWidth: 32,
                height: 32,
                "&:hover": { bgcolor: "action.hover" },
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderColor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              },
            }}
          />
        </Box>
      )}

      {/* Add dialog */}
      <SaleDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={handleRefresh} />

      {/* Edit dialog */}
      {selectedSale && (
        <SaleDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedSale(null);
          }}
          initialData={selectedSale}
          onSuccess={handleRefresh}
        />
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        maxWidth='xs'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary" }}>
            This action cannot be undone. This will permanently delete the sale record.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
            variant='outlined'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant='contained'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
