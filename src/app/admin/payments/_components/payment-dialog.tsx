"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalTitle, ModalContent, ModalContentText, ModalActions } from "@/components/ui/modal";
import { FormControl, Select, MenuItem } from "@/components/ui/select";

import { PaymentEndpoints } from "@/query-client/payments";
import { createPaymentInputSchema, type CreatePaymentInput } from "@/server/schemas";

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

export function PaymentDialog({ initialData, open, onOpenChange, onSuccess }: PaymentDialogProps) {
  const toast = useToast();
  const form = useForm<CreatePaymentInput>({
    resolver: zodResolver(createPaymentInputSchema) as any,
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

  async function onSubmit(values: CreatePaymentInput) {
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
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "12px", maxWidth: 525 } } }}
    >
      <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
        <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{initialData ? "Edit Payment" : "Add Payment"}</ModalTitle>

        <ModalContent dividers>
          <ModalContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
            {initialData ? "Update the payment details." : "Add a new payment record to the history."}
          </ModalContentText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Amount */}
            <Box>
              <Label htmlFor='payment-amount'>Amount</Label>
              <TextField
                id='payment-amount'
                type='number'
                fullWidth
                size='small'
                inputRef={amountRef}
                {...amountProps}
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!form.formState.errors.amount}
                helperText={form.formState.errors.amount?.message}
              />
            </Box>

            {/* Method + Status */}
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Label htmlFor='payment-method'>Method</Label>
                <Controller
                  name='method'
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth size='small'>
                      <Select
                        id='payment-method'
                        value={field.value || "CASH"}
                        onChange={field.onChange}
                      >
                        {METHOD_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {form.formState.errors.method && (
                  <Box component='p' sx={{ fontSize: 12, color: "error.main", m: 0, mt: 0.5 }}>
                    {form.formState.errors.method.message}
                  </Box>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Label htmlFor='payment-status'>Status</Label>
                <Controller
                  name='status'
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth size='small'>
                      <Select
                        id='payment-status'
                        value={field.value || "COMPLETED"}
                        onChange={field.onChange}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {form.formState.errors.status && (
                  <Box component='p' sx={{ fontSize: 12, color: "error.main", m: 0, mt: 0.5 }}>
                    {form.formState.errors.status.message}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Transaction ID */}
            <Box>
              <Label htmlFor='payment-txn'>Transaction ID (Optional)</Label>
              <TextField id='payment-txn' fullWidth size='small' inputRef={transactionRef} {...transactionProps} />
            </Box>

            {/* Date */}
            <Box>
              <Label htmlFor='payment-date'>Date</Label>
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
            <Box>
              <Label htmlFor='payment-note'>Note (Optional)</Label>
              <TextField id='payment-note' fullWidth size='small' inputRef={noteRef} {...noteProps} />
            </Box>
          </Box>
        </ModalContent>

        <ModalActions sx={{ p: 2 }}>
          <Button type='submit' variant='contained' disableElevation>
            {initialData ? "Update Payment" : "Add Payment"}
          </Button>
        </ModalActions>
      </Box>
    </Modal>
  );
}
