"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  CircularProgress,
  DataTable,
  type DataTableColumn,
} from "@/components/ui";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { useExpenseSummary, useCreateExpense } from "@/query-client/expenses";
import { createExpenseInputSchema, type CreateExpenseInput } from "@/server/schemas";

export default function ExpenseSummaryPage() {
  const { data: summary, isLoading } = useExpenseSummary();
  const { mutateAsync: createExpense, isPending: saving } = useCreateExpense();

  const form = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseInputSchema) as any,
    defaultValues: {
      category: "General",
      amount: undefined,
      note: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (values: CreateExpenseInput) => {
    await createExpense({
      category: values.category || "General",
      amount: Number(values.amount),
      note: values.note || undefined,
      date: values.date ? new Date(values.date) : new Date(),
    });
    form.reset({
      category: "General",
      amount: undefined,
      note: "",
      date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "date",
        header: "Date",
        cell: (row) => (
          <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
            {row.date ? format(new Date(row.date), "dd MMM yyyy") : "—"}
          </Typography>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: (row) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            ৳{Number(row.amount).toLocaleString()}
          </Typography>
        ),
      },
      {
        id: "note",
        header: "Note",
        cell: (row) => (
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {row.note || "—"}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title="Expenses"
        description="Track expense totals for last 7 days, 30 days, and last 1 year."
      />

      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        {[
          { label: "Last 7 Days Expense", value: summary?.last7DaysExpense || 0 },
          { label: "Last 30 Days Expense", value: summary?.last30DaysExpense || 0 },
          { label: "Last 1 Year Expense", value: summary?.lastYearExpense || 0 },
        ].map((card) => (
          <Card key={card.label}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                color: "text.secondary",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.625rem",
                fontWeight: 800,
                color: "text.primary",
                mt: 1,
                lineHeight: 1.2,
              }}
            >
              ৳{card.value.toLocaleString()}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Add expense */}
      <Card>
        <CardHeader
          title="Add New Expense"
          titleTypographyProps={{ sx: { fontSize: "0.95rem", fontWeight: 700 } }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Box
            component="form"
            onSubmit={form.handleSubmit(onSubmit)}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" },
              gap: 1.5,
              alignItems: "flex-start",
            }}
          >
            <TextField
              type="number"
              placeholder="Amount *"
              {...form.register("amount", { valueAsNumber: true })}
              error={Boolean(form.formState.errors.amount)}
              helperText={form.formState.errors.amount?.message}
              slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              fullWidth
            />
            <TextField
              type="text"
              placeholder="Note (optional)"
              {...form.register("note")}
              error={Boolean(form.formState.errors.note)}
              helperText={form.formState.errors.note?.message}
              fullWidth
            />
            <TextField
              type="date"
              {...form.register("date")}
              error={Boolean(form.formState.errors.date)}
              helperText={form.formState.errors.date?.message}
              fullWidth
            />
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
              sx={{ height: 40 }}
            >
              {saving ? "Saving..." : "Save Expense"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography component="h3" sx={{ fontSize: "1.05rem", fontWeight: 700, color: "text.primary" }}>
          Recent Expenses
        </Typography>

        <DataTable
          columns={columns}
          data={summary?.recent ?? []}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="No expenses recorded yet."
        />
      </Box>
    </Box>
  );
}

