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
    resolver: zodResolver(createSaleInputSchema) as any,
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
        productName: values.productName,
        quantity: values.quantity,
        buyPrice: values.buyPrice,
        sellPrice: values.sellPrice,
        boostingCost: values.boostingCost,
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        address: values.address,
        sellerName: values.sellerName,
        status: values.status,
        date: values.date || new Date(),
      };

      if (initialData) {
        const result = await SaleEndpoints.updateSale({ id: initialData.id, data: payload });
        if (result?.success) {
          toast.success("Sale updated successfully");
          onOpenChange(false);
          form.reset();
          onSuccess?.();
        } else {
          toast.error("Failed to update sale");
        }
      } else {
        const result = await SaleEndpoints.createSale(payload);
        if (result?.success) {
          toast.success("Sale added successfully");
          onOpenChange(false);
          form.reset();
          onSuccess?.();
        } else {
          toast.error("Failed to add sale");
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  // ─── RHF register refs ────────────────────────────────────
  const { ref: productRef, ...productProps } = form.register("productName");
  const { ref: qtyRef, ...qtyProps } = form.register("quantity");
  const { ref: customerRef, ...customerProps } = form.register("customerName");
  const { ref: phoneRef, ...phoneProps } = form.register("phoneNumber");
  const { ref: sellerRef, ...sellerProps } = form.register("sellerName");
  const { ref: addressRef, ...addressProps } = form.register("address");
  const { ref: buyRef, ...buyProps } = form.register("buyPrice");
  const { ref: sellRef, ...sellProps } = form.register("sellPrice");
  const { ref: boostingRef, ...boostingProps } = form.register("boostingCost");

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "12px", maxWidth: 625 } } }}
    >
      <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
        <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{initialData ? "Edit Sale" : "Add Sale"}</ModalTitle>

        <ModalContent dividers>
          <ModalContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
            {initialData ? "Update the sale details." : "Record a new manual sale."}
          </ModalContentText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Product Name */}
            <Box>
              <Label htmlFor='sale-product'>Product Name</Label>
              <TextField
                id='sale-product'
                placeholder='Enter product name'
                fullWidth
                size='small'
                inputRef={productRef}
                {...productProps}
                error={!!form.formState.errors.productName}
                helperText={form.formState.errors.productName?.message}
              />
            </Box>

            {/* Quantity */}
            <Box sx={gridTwo}>
              <Box>
                <Label htmlFor='sale-qty'>Quantity</Label>
                <TextField
                  id='sale-qty'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={qtyRef}
                  {...qtyProps}
                  error={!!form.formState.errors.quantity}
                  helperText={form.formState.errors.quantity?.message}
                />
              </Box>
            </Box>

            {/* Customer Name */}
            <Box>
              <Label htmlFor='sale-customer'>Customer Name</Label>
              <TextField
                id='sale-customer'
                placeholder='Enter customer name'
                fullWidth
                size='small'
                inputRef={customerRef}
                {...customerProps}
                error={!!form.formState.errors.customerName}
                helperText={form.formState.errors.customerName?.message}
              />
            </Box>

            {/* Phone + Seller */}
            <Box sx={gridTwo}>
              <Box>
                <Label htmlFor='sale-phone'>Phone Number</Label>
                <TextField
                  id='sale-phone'
                  placeholder='Enter phone number'
                  fullWidth
                  size='small'
                  inputRef={phoneRef}
                  {...phoneProps}
                  error={!!form.formState.errors.phoneNumber}
                  helperText={form.formState.errors.phoneNumber?.message}
                />
              </Box>
              <Box>
                <Label htmlFor='sale-seller'>Seller Name</Label>
                <TextField
                  id='sale-seller'
                  placeholder='Enter seller name'
                  fullWidth
                  size='small'
                  inputRef={sellerRef}
                  {...sellerProps}
                  error={!!form.formState.errors.sellerName}
                  helperText={form.formState.errors.sellerName?.message}
                />
              </Box>
            </Box>

            {/* Address */}
            <Box>
              <Label htmlFor='sale-address'>Address</Label>
              <TextField
                id='sale-address'
                placeholder='Enter address'
                fullWidth
                size='small'
                inputRef={addressRef}
                {...addressProps}
                error={!!form.formState.errors.address}
                helperText={form.formState.errors.address?.message}
              />
            </Box>

            {/* Prices: Buy / Sell / Boosting */}
            <Box sx={gridThree}>
              <Box>
                <Label htmlFor='sale-buy'>Buy Price</Label>
                <TextField
                  id='sale-buy'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={buyRef}
                  {...buyProps}
                  slotProps={{ htmlInput: { step: "0.01" } }}
                  error={!!form.formState.errors.buyPrice}
                  helperText={form.formState.errors.buyPrice?.message}
                />
              </Box>
              <Box>
                <Label htmlFor='sale-sell'>Sell Price</Label>
                <TextField
                  id='sale-sell'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={sellRef}
                  {...sellProps}
                  slotProps={{ htmlInput: { step: "0.01" } }}
                  error={!!form.formState.errors.sellPrice}
                  helperText={form.formState.errors.sellPrice?.message}
                />
              </Box>
              <Box>
                <Label htmlFor='sale-boosting'>Boosting</Label>
                <TextField
                  id='sale-boosting'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={boostingRef}
                  {...boostingProps}
                  slotProps={{ htmlInput: { step: "0.01" } }}
                  error={!!form.formState.errors.boostingCost}
                  helperText={form.formState.errors.boostingCost?.message}
                />
              </Box>
            </Box>

            {/* Status + Date */}
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Label htmlFor='sale-status'>Status</Label>
                <Controller
                  name='status'
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth size='small'>
                      <Select
                        id='sale-status'
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
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Label htmlFor='sale-date'>Date</Label>
                <Controller
                  name='date'
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      id='sale-date'
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
              </Box>
            </Box>
          </Box>
        </ModalContent>

        <ModalActions sx={{ p: 2 }}>
          <Button type='submit' variant='contained' disableElevation>
            {initialData ? "Update Sale" : "Save Sale"}
          </Button>
        </ModalActions>
      </Box>
    </Modal>
  );
}
