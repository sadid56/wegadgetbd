"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { InputBase } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dropdown } from "@/components/ui/dropdown";
import { AlertDialog } from "@/components/ui/alert-dialog";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { usePayments, useDeletePayment } from "@/query-client/payments";
import { PaymentDialog } from "./_components/payment-dialog";

function PaymentStatusChip({ status }: { status: string }) {
  if (status === "COMPLETED") {
    return <Badge variant='success'>{status}</Badge>;
  }
  if (status === "PENDING") {
    return <Badge variant='warning'>{status}</Badge>;
  }
  return <Badge variant='danger'>{status}</Badge>;
}

export default function PaymentsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = usePayments({
    search: search.trim() || undefined,
    page: page + 1,
    limit: rowsPerPage,
  });

  const { mutate: deletePayment } = useDeletePayment();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      deletePayment(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          refetch();
        },
      });
    }
  };

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "date",
        header: "Date",
        cell: (payment) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.secondary" }}>
            {payment.date ? format(new Date(payment.date), "MMM d, yyyy") : "—"}
          </Box>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: (payment) => (
          <Box component='span' sx={{ fontWeight: 600, color: "text.primary" }}>
            {new Intl.NumberFormat("en-BD", {
              style: "currency",
              currency: "BDT",
            }).format(Number(payment.amount))}
          </Box>
        ),
      },
      {
        id: "method",
        header: "Method",
        cell: (payment) => <Badge variant='outline'>{payment.method}</Badge>,
      },
      {
        id: "status",
        header: "Status",
        cell: (payment) => <PaymentStatusChip status={payment.status} />,
      },
      {
        id: "transactionId",
        header: "Transaction ID",
        cell: (payment) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.primary" }}>
            {payment.transactionId || "—"}
          </Box>
        ),
      },
      {
        id: "note",
        header: "Note",
        cell: (payment) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.secondary" }}>
            {payment.note || "—"}
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (payment) => (
          <Dropdown
            title='Actions'
            items={[
              {
                label: "Edit",
                icon: <EditOutlinedIcon sx={{ fontSize: 18 }} />,
                action: () => {
                  setSelectedPayment(payment);
                  setIsEditDialogOpen(true);
                },
              },
              "divider",
              {
                label: "Delete",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => setDeleteId(payment.id),
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
        title='Payments'
        description='Track incoming and outgoing payment records.'
        action={
          <Button variant='primary' onClick={() => setIsAddDialogOpen(true)} startIcon={<AddIcon sx={{ fontSize: 16 }} />}>
            Record Payment
          </Button>
        }
      />

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: 384 }}>
        <InputBase
          placeholder='Search payments...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
        />
      </Box>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={data?.payments ?? []}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyMessage='No payments found.'
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={data?.metadata?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Record Payment Dialog */}
      <PaymentDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => setIsAddDialogOpen(open)}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          refetch();
        }}
      />

      {/* Edit Payment Dialog */}
      {selectedPayment && (
        <PaymentDialog
          open={isEditDialogOpen}
          initialData={selectedPayment}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedPayment(null);
          }}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            setSelectedPayment(null);
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title='Delete Payment Record?'
        description='This action will permanently delete this payment transaction. It cannot be undone.'
        confirmText='Delete'
        confirmVariant='destructive'
      />
    </Box>
  );
}
