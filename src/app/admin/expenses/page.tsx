"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { CircularProgress } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/components/ui/table";

import { ExpenseEndpoints } from "@/query-client/expenses";
import { tokens } from "@/theme/theme";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: 14,
    bgcolor: "background.paper",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "text.disabled" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
} as const;

const cardSx = {
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  p: 2,
} as const;

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
} as const;

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: 14,
  borderRadius: "8px",
  height: 40,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  "&:hover": { bgcolor: "primary.dark" },
} as const;

export default function ExpenseSummaryPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const loadSummary = async () => {
    try {
      const result = await ExpenseEndpoints.getSummary();
      if (result) {
        setSummary(result);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleAddExpense = async () => {
    if (!amount) {
      toast.error("Amount is required");
      return;
    }

    setSaving(true);
    try {
      const res = await ExpenseEndpoints.createExpense({
        category: "General",
        amount: Number(amount),
        note,
        date: date ? new Date(date) : new Date(),
      });
      setSaving(false);

      if (!res?.success) {
        toast.error((res as any)?.message || "Failed to add expense");
        return;
      }

      toast.success("Expense added");
      setAmount("");
      setNote("");
      setDate("");
      await loadSummary();
    } catch (err: any) {
      setSaving(false);
      toast.error(err?.message || "Failed to add expense");
    }
  };

  if (loading && !summary) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography component='h1' sx={{ fontSize: 24, fontWeight: 900, color: "text.primary", letterSpacing: "-0.02em" }}>
          Daily Expense Summary
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          Track expense totals for last 7 days, 30 days, and last 1 year.
        </Typography>
      </Box>

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
          <Box key={card.label} sx={cardSx}>
            <Box
              component='p'
              sx={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "text.secondary",
                m: 0,
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              {card.label}
            </Box>
            <Box
              component='p'
              sx={{
                fontSize: 24,
                fontWeight: 900,
                color: "text.primary",
                m: 0,
                mt: 1,
                lineHeight: 1.2,
              }}
            >
              ৳{card.value}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Add expense */}
      <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography component='h2' sx={{ fontSize: 16, fontWeight: 900, color: "text.primary" }}>
          Add Expense
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
            gap: 1.5,
          }}
        >
          <TextField
            type='number'
            placeholder='Amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size='small'
            fullWidth
            sx={inputSx}
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />
          <TextField
            type='text'
            placeholder='Note (optional)'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            size='small'
            fullWidth
            sx={inputSx}
          />
          <TextField
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size='small'
            fullWidth
            sx={inputSx}
          />
          <Button
            onClick={handleAddExpense}
            disabled={saving}
            disableElevation
            startIcon={saving ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
            sx={{ ...primaryButtonSx, height: "100%", minHeight: 40 }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["Date", "Amount", "Note"].map((head) => (
                <TableCell key={head} sx={tableHeadSx}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {summary?.recent?.length ? (
              summary.recent.map((row: any) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{format(new Date(row.date), "dd MMM yyyy")}</TableCell>
                  <TableCell sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>৳{row.amount}</TableCell>
                  <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{row.note || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ height: 96, textAlign: "center", color: "text.secondary", fontSize: 14 }}>
                  No expenses yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
