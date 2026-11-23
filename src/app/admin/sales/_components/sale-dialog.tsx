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

import { SaleEndpoints } from "@/query-client/sales";
import { createSaleInputSchema, type CreateSaleInput } from "@/server/schemas";

interface SaleDialogProps {
  initialData?: {
    id: string;
    productName: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    boostingCost: number;
    customerName: string;
    phoneNumber?: string;
    address?: string;
    sellerName?: string;
    status: string;
    date: Date;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Completed" },
  { value: "DELIVERED", label: "Successful Delivery" },
  { value: "RETURNED", label: "Returned" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 2,
} as const;

const gridThree = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 2,
} as const;

export function SaleDialog({ initialData, open, onOpenChange, onSuccess }: SaleDialogProps) {
  const toast = useToast();
  const form = useForm<CreateSaleInput>({
    resolver: zodResolver(createSaleInputSchema) as Resolver<CreateSaleInput>,
    defaultValues: {
      productName: "",
      quantity: 1,
      buyPrice: 0,
      sellPrice: 0,
      boostingCost: 0,
      customerName: "",
      phoneNumber: "",
      address: "",
      sellerName: "",
      status: "COMPLETED",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName,
        quantity: initialData.quantity,
        buyPrice: Number(initialData.buyPrice),
        sellPrice: Number(initialData.sellPrice),
        boostingCost: Number(initialData.boostingCost),
        customerName: initialData.customerName,
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
        sellerName: initialData.sellerName || "",
        status: initialData.status,
        date: new Date(initialData.date),
      });
    } else {
      form.reset({
        productName: "",
        quantity: 1,
        buyPrice: 0,
        sellPrice: 0,
        boostingCost: 0,
        customerName: "",
        phoneNumber: "",
        address: "",
        sellerName: "",
        status: "COMPLETED",
        date: new Date(),
      });
    }
  }, [initialData, form, open]);

  async function onSubmit(values: CreateSaleInput) {
    try {
      const payload = {
        ...values,
        date: values.date || new Date(),
      };

      const result = initialData
        ? await SaleEndpoints.updateSale({ id: initialData.id, data: payload })
        : await SaleEndpoints.createSale(payload);

      if (result?.success) {
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(initialData ? "Failed to update sale" : "Failed to add sale");
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
      slotProps={{ paper: { sx: { borderRadius: "12px", maxWidth: { xs: "100%", sm: 625 } } } }}
    >
      <Form {...form}>
        <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
          <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{initialData ? "Edit Sale" : "Add Sale"}</ModalTitle>

          <ModalContent dividers>
            <ModalContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              {initialData ? "Update the sale details." : "Record a new manual sale."}
            </ModalContentText>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormField
                control={form.control}
                name='productName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <TextField placeholder='Enter product name' fullWidth size='small' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Box sx={gridTwo}>
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <TextField
                          type='number'
                          fullWidth
                          size='small'
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Box>

              <FormField
                control={form.control}
                name='customerName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <TextField placeholder='Enter customer name' fullWidth size='small' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Box sx={gridTwo}>
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <TextField placeholder='Enter phone number' fullWidth size='small' {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sellerName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Name</FormLabel>
                      <FormControl>
                        <TextField placeholder='Enter seller name' fullWidth size='small' {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Box>

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <TextField placeholder='Enter address' fullWidth size='small' {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Box sx={gridThree}>
                <FormField
                  control={form.control}
                  name='buyPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy Price</FormLabel>
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
                <FormField
                  control={form.control}
                  name='sellPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sell Price</FormLabel>
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
                <FormField
                  control={form.control}
                  name='boostingCost'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boosting</FormLabel>
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
              </Box>

              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
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

                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem sx={{ flex: 1, minWidth: 0 }}>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={(d) => field.onChange(d)}
                          maxDate={new Date()}
                          minDate={new Date(1900, 0, 1)}
                          placeholder='Select sale date'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Box>
            </Box>
          </ModalContent>

          <ModalActions sx={{ p: 2 }}>
            <Button type='submit' variant='contained' disableElevation loading={form.formState.isSubmitting}>
              {initialData ? "Update Sale" : "Save Sale"}
            </Button>
          </ModalActions>
        </Box>
      </Form>
    </Modal>
  );
}
