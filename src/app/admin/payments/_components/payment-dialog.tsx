"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@/components/ui/dialog";
import { FormControl, Select, MenuItem } from "@/components/ui/select";

import { PaymentEndpoints } from "@/query-client/payments";
import { tokens } from "@/theme/theme";

const formSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  method: z.enum(["CASH", "BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "OTHER"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
  transactionId: z.string().optional(),
  date: z.date().optional(),
  note: z.string().optional(),
});

interface PaymentDialogProps {
  initialData?: {
    id: string;
    amount: number;
    method: "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" | "OTHER";
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    transactionId?: string | null;
    date: Date;
    note?: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const METHOD_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "OTHER", label: "Other" },
] as const;

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

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

const selectSx = {
  borderRadius: "8px",
  fontSize: 14,
  bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.disabled" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
} as const;

const labelSx = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  color: "text.primary",
  mb: 1,
} as const;

const fieldWrapSx = { display: "flex", flexDirection: "column" as const } as const;

export function PaymentDialog({ initialData, open, onOpenChange, onSuccess }: PaymentDialogProps) {
  const toast = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      amount: 0,
      method: "CASH",
      status: "COMPLETED",
      transactionId: "",
      note: "",
      date: new Date(),
    },
  });

  const { ref: amountRef, ...amountProps } = form.register("amount");
  const { ref: transactionRef, ...transactionProps } = form.register("transactionId");
  const { ref: noteRef, ...noteProps } = form.register("note");

  useEffect(() => {
    if (initialData) {
      form.reset({
        amount: Number(initialData.amount),
        method: initialData.method,
        status: initialData.status,
        transactionId: initialData.transactionId || "",
        note: initialData.note || "",
        date: new Date(initialData.date),
      });
    } else {
      form.reset({
        amount: 0,
        method: "CASH",
        status: "COMPLETED",
        transactionId: "",
        note: "",
        date: new Date(),
      });
    }
  }, [initialData, form, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (initialData) {
        const result = await PaymentEndpoints.updatePayment({
          id: initialData.id,
          data: {
            ...values,
            date: values.date || new Date(),
          },
        });

        if (result?.success) {
          toast.success("Payment updated successfully");
          onOpenChange(false);
          form.reset();
          if (onSuccess) onSuccess();
        } else {
          toast.error("Failed to update payment");
        }
      } else {
        const result = await PaymentEndpoints.createPayment({
          ...values,
          date: values.date || new Date(),
        });

        if (result?.success) {
          toast.success("Payment added successfully");
          onOpenChange(false);
          form.reset();
          if (onSuccess) onSuccess();
        } else {
          toast.error("Failed to add payment");
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "12px", maxWidth: 525 } } }}
    >
      <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{initialData ? "Edit Payment" : "Add Payment"}</DialogTitle>

        <DialogContent dividers>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
            {initialData ? "Update the payment details." : "Add a new payment record to the history."}
          </DialogContentText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Amount */}
            <Box sx={fieldWrapSx}>
              <Box component='label' htmlFor='payment-amount' sx={labelSx}>
                Amount
              </Box>
              <TextField
                id='payment-amount'
                type='number'
                fullWidth
                size='small'
                inputRef={amountRef}
                {...amountProps}
                sx={inputSx}
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!form.formState.errors.amount}
                helperText={form.formState.errors.amount?.message}
              />
            </Box>

            {/* Method + Status */}
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Box sx={{ ...fieldWrapSx, flex: 1, minWidth: 0 }}>
                <Box component='label' htmlFor='payment-method' sx={labelSx}>
                  Method
                </Box>
                <FormControl fullWidth size='small'>
                  <Select
                    id='payment-method'
                    value={form.watch("method")}
                    onChange={(e) =>
                      form.setValue("method", e.target.value as any, {
                        shouldValidate: true,
                      })
                    }
                    sx={selectSx}
                  >
                    {METHOD_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {form.formState.errors.method && (
                  <Box component='p' sx={{ fontSize: 12, color: "error.main", m: 0, mt: 0.5 }}>
                    {form.formState.errors.method.message}
                  </Box>
                )}
              </Box>

              <Box sx={{ ...fieldWrapSx, flex: 1, minWidth: 0 }}>
                <Box component='label' htmlFor='payment-status' sx={labelSx}>
                  Status
                </Box>
                <FormControl fullWidth size='small'>
                  <Select
                    id='payment-status'
                    value={form.watch("status")}
                    onChange={(e) =>
                      form.setValue("status", e.target.value as any, {
                        shouldValidate: true,
                      })
                    }
                    sx={selectSx}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {form.formState.errors.status && (
                  <Box component='p' sx={{ fontSize: 12, color: "error.main", m: 0, mt: 0.5 }}>
                    {form.formState.errors.status.message}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Transaction ID */}
            <Box sx={fieldWrapSx}>
              <Box component='label' htmlFor='payment-txn' sx={labelSx}>
                Transaction ID (Optional)
              </Box>
              <TextField id='payment-txn' fullWidth size='small' inputRef={transactionRef} {...transactionProps} sx={inputSx} />
            </Box>

            {/* Date */}
            <Box sx={fieldWrapSx}>
              <Box component='label' htmlFor='payment-date' sx={labelSx}>
                Date
              </Box>
              <Controller
                name='date'
                control={form.control}
                render={({ field }) => (
                  <TextField
                    id='payment-date'
                    type='date'
                    fullWidth
                    size='small'
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v ? new Date(v) : undefined);
                    }}
                    onBlur={field.onBlur}
                    sx={inputSx}
                    slotProps={{
                      htmlInput: {
                        max: format(new Date(), "yyyy-MM-dd"),
                        min: "1900-01-01",
                      },
                    }}
                  />
                )}
              />
              {form.formState.errors.date && (
                <Box component='p' sx={{ fontSize: 12, color: "error.main", m: 0, mt: 0.5 }}>
                  {form.formState.errors.date.message}
                </Box>
              )}
            </Box>

            {/* Note */}
            <Box sx={fieldWrapSx}>
              <Box component='label' htmlFor='payment-note' sx={labelSx}>
                Note (Optional)
              </Box>
              <TextField id='payment-note' fullWidth size='small' inputRef={noteRef} {...noteProps} sx={inputSx} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            type='submit'
            variant='contained'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              height: 40,
              px: 2.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {initialData ? "Update Payment" : "Add Payment"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
