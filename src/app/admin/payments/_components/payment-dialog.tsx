"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/context/toast-context";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { Modal, ModalTitle, ModalContent, ModalContentText, ModalActions } from "@/components/ui/modal";
import { FormControl as SelectFormControl, Select, MenuItem } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
    resolver: zodResolver(createPaymentInputSchema) as Resolver<CreatePaymentInput>,
    defaultValues: {
      amount: 0,
      method: "CASH",
      status: "COMPLETED",
      transactionId: "",
      note: "",
      date: new Date(),
    },
  });

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
      const payload = {
        ...values,
        date: values.date || new Date(),
      };
      const result = initialData
        ? await PaymentEndpoints.updatePayment({ id: initialData.id, data: payload })
        : await PaymentEndpoints.createPayment(payload);

      if (result?.success) {
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      showCloseButton
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "12px", maxWidth: { xs: "100%", sm: 525 } } } }}
    >
      <Form {...form}>
        <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
          <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{initialData ? "Edit Payment" : "Add Payment"}</ModalTitle>

          <ModalContent dividers>
            <ModalContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              {initialData ? "Update the payment details." : "Add a new payment record to the history."}
            </ModalContentText>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <TextField
                        type='number'
                        fullWidth
                        size='small'
                        slotProps={{ htmlInput: { step: "0.01" } }}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <FormField
                  control={form.control}
                  name='method'
                  render={({ field }) => (
                    <FormItem sx={{ flex: 1, minWidth: 0 }}>
                      <FormLabel>Method</FormLabel>
                      <FormControl>
                        <SelectFormControl fullWidth size='small'>
                          <Select value={field.value || "CASH"} onChange={field.onChange}>
                            {METHOD_OPTIONS.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </SelectFormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem sx={{ flex: 1, minWidth: 0 }}>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <SelectFormControl fullWidth size='small'>
                          <Select value={field.value || "COMPLETED"} onChange={field.onChange}>
                            {STATUS_OPTIONS.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </SelectFormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Box>

              <FormField
                control={form.control}
                name='transactionId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID (Optional)</FormLabel>
                    <FormControl>
                      <TextField fullWidth size='small' {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(d) => field.onChange(d)}
                        maxDate={new Date()}
                        minDate={new Date(1900, 0, 1)}
                        placeholder='Select payment date'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <FormControl>
                      <TextField fullWidth size='small' {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
          </ModalContent>

          <ModalActions sx={{ p: 2, gap: 1 }}>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' disableElevation loading={form.formState.isSubmitting}>
              {initialData ? "Update Payment" : "Add Payment"}
            </Button>
          </ModalActions>
        </Box>
      </Form>
    </Modal>
  );
}
