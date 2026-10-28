"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";

import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { getPayments, deletePayment } from "@/actions/payment";
import { PaymentDialog } from "./_components/payment-dialog";

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

function PaymentStatusChip({ status }: { status: string }) {
  if (status === "COMPLETED") {
    return (
      <Chip
        label={status}
        size='small'
        variant='outlined'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: "#dcfce7",
          color: "#166534",
          borderColor: "#bbf7d0",
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  if (status === "PENDING") {
    return (
      <Chip
        label={status}
        size='small'
        variant='outlined'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: "#fef9c3",
          color: "#854d0e",
          borderColor: "#fef08a",
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
        bgcolor: "error.main",
        color: "error.contrastText",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

export default function PaymentsPage() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const [payments, setPayments] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { payments, metadata } = await getPayments({ page, search });
      setPayments(payments);
      setTotalPages(metadata.totalPages);
      setLoading(false);
    }
    fetchData();
  }, [page, search, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deletePayment(deleteId);
    if (res.success) {
      toast.success("Payment deleted successfully");
      setDeleteId(null);
      handleRefresh();
    } else {
      toast.error("Failed to delete payment");
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    router.push(`?page=1&search=${query}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Payment History
        </Typography>
        <Button variant='contained' disableElevation onClick={() => setIsAddDialogOpen(true)} sx={primaryButtonSx}>
          Add Payment
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ position: "relative", flex: 1, maxWidth: 384 }}>
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
              placeholder='Search by note or transaction ID...'
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
              <TableCell sx={tableHeadSx}>Date</TableCell>
              <TableCell sx={tableHeadSx}>Amount</TableCell>
              <TableCell sx={tableHeadSx}>Method</TableCell>
              <TableCell sx={tableHeadSx}>Status</TableCell>
              <TableCell sx={tableHeadSx}>Transaction ID</TableCell>
              <TableCell sx={tableHeadSx}>Note</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "text.primary" }}>
                    {new Intl.NumberFormat("en-BD", {
                      style: "currency",
                      currency: "BDT",
                    }).format(Number(payment.amount))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.method}
                      size='small'
                      variant='outlined'
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 600,
                        borderColor: "divider",
                        color: "text.primary",
                        "& .MuiChip-label": { px: 1.25 },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusChip status={payment.status} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: "text.primary" }}>{payment.transactionId || "-"}</TableCell>
                  <TableCell sx={{ fontSize: 13, color: "text.secondary" }}>{payment.note || "-"}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        size='small'
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsEditDialogOpen(true);
                        }}
                        aria-label='Edit payment'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "text.secondary",
                          "&:hover": {
                            bgcolor: "action.hover",
                            color: "text.primary",
                          },
                        }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => setDeleteId(payment.id)}
                        aria-label='Delete payment'
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
            onChange={(_, p) => router.push(`?page=${p}&search=${search}`)}
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
      <PaymentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={handleRefresh} />

      {/* Edit dialog */}
      {selectedPayment && (
        <PaymentDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedPayment(null);
          }}
          initialData={selectedPayment}
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
            This action cannot be undone. This will permanently delete the payment record.
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
              "&:hover": {
                borderColor: "text.disabled",
                bgcolor: "action.hover",
              },
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
