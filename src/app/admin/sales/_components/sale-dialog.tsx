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

import { SaleEndpoints } from "@/query-client/sales";
import { tokens } from "@/theme/theme";

const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  buyPrice: z.coerce.number().min(0, "Buy price must be positive"),
  sellPrice: z.coerce.number().min(0, "Sell price must be positive"),
  boostingCost: z.coerce.number().min(0, "Boosting cost must be positive"),
  customerName: z.string().min(1, "Customer name is required"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  sellerName: z.string().optional(),
  status: z.string().default("COMPLETED"),
  date: z.date().optional(),
});

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

const helperTextSx = { fontSize: 12, mx: 0 } as const;

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "12px", maxWidth: 625 } } }}
    >
      <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{initialData ? "Edit Sale" : "Add Sale"}</DialogTitle>

        <DialogContent dividers>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
            {initialData ? "Update the sale details." : "Record a new manual sale."}
          </DialogContentText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Product Name */}
            <Box>
              <Box component='label' htmlFor='sale-product' sx={labelSx}>
                Product Name
              </Box>
              <TextField
                id='sale-product'
                placeholder='Enter product name'
                fullWidth
                size='small'
                inputRef={productRef}
                {...productProps}
                sx={inputSx}
                error={!!form.formState.errors.productName}
                helperText={form.formState.errors.productName?.message}
              />
            </Box>

            {/* Quantity */}
            <Box sx={gridTwo}>
              <Box>
                <Box component='label' htmlFor='sale-qty' sx={labelSx}>
                  Quantity
                </Box>
                <TextField
                  id='sale-qty'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={qtyRef}
                  {...qtyProps}
                  sx={inputSx}
                  error={!!form.formState.errors.quantity}
                  helperText={form.formState.errors.quantity?.message}
                />
              </Box>
            </Box>

            {/* Customer Name */}
            <Box>
              <Box component='label' htmlFor='sale-customer' sx={labelSx}>
                Customer Name
              </Box>
              <TextField
                id='sale-customer'
                placeholder='Enter customer name'
                fullWidth
                size='small'
                inputRef={customerRef}
                {...customerProps}
                sx={inputSx}
                error={!!form.formState.errors.customerName}
                helperText={form.formState.errors.customerName?.message}
              />
            </Box>

            {/* Phone + Seller */}
            <Box sx={gridTwo}>
              <Box>
                <Box component='label' htmlFor='sale-phone' sx={labelSx}>
                  Phone Number
                </Box>
                <TextField
                  id='sale-phone'
                  placeholder='Enter phone number'
                  fullWidth
                  size='small'
                  inputRef={phoneRef}
                  {...phoneProps}
                  sx={inputSx}
                  error={!!form.formState.errors.phoneNumber}
                  helperText={form.formState.errors.phoneNumber?.message}
                />
              </Box>
              <Box>
                <Box component='label' htmlFor='sale-seller' sx={labelSx}>
                  Seller Name
                </Box>
                <TextField
                  id='sale-seller'
                  placeholder='Enter seller name'
                  fullWidth
                  size='small'
                  inputRef={sellerRef}
                  {...sellerProps}
                  sx={inputSx}
                  error={!!form.formState.errors.sellerName}
                  helperText={form.formState.errors.sellerName?.message}
                />
              </Box>
            </Box>

            {/* Address */}
            <Box>
              <Box component='label' htmlFor='sale-address' sx={labelSx}>
                Address
              </Box>
              <TextField
                id='sale-address'
                placeholder='Enter address'
                fullWidth
                size='small'
                inputRef={addressRef}
                {...addressProps}
                sx={inputSx}
                error={!!form.formState.errors.address}
                helperText={form.formState.errors.address?.message}
              />
            </Box>

            {/* Prices: Buy / Sell / Boosting */}
            <Box sx={gridThree}>
              <Box>
                <Box component='label' htmlFor='sale-buy' sx={labelSx}>
                  Buy Price
                </Box>
                <TextField
                  id='sale-buy'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={buyRef}
                  {...buyProps}
                  sx={inputSx}
                  slotProps={{ htmlInput: { step: "0.01" } }}
                  error={!!form.formState.errors.buyPrice}
                  helperText={form.formState.errors.buyPrice?.message}
                />
              </Box>
              <Box>
                <Box component='label' htmlFor='sale-sell' sx={labelSx}>
                  Sell Price
                </Box>
                <TextField
                  id='sale-sell'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={sellRef}
                  {...sellProps}
                  sx={inputSx}
                  slotProps={{ htmlInput: { step: "0.01" } }}
                  error={!!form.formState.errors.sellPrice}
                  helperText={form.formState.errors.sellPrice?.message}
                />
              </Box>
              <Box>
                <Box component='label' htmlFor='sale-boosting' sx={labelSx}>
                  Boosting
                </Box>
                <TextField
                  id='sale-boosting'
                  type='number'
                  fullWidth
                  size='small'
                  inputRef={boostingRef}
                  {...boostingProps}
                  sx={inputSx}
                  slotProps={{ htmlInput: { step: "0.01" } }}
                  error={!!form.formState.errors.boostingCost}
                  helperText={form.formState.errors.boostingCost?.message}
                />
              </Box>
            </Box>

            {/* Status + Date */}
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box component='label' htmlFor='sale-status' sx={labelSx}>
                  Status
                </Box>
                <Controller
                  name='status'
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth size='small'>
                      <Select
                        id='sale-status'
                        value={field.value || ""}
                        onChange={field.onChange}
                        displayEmpty
                        sx={selectSx}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Box component='span' sx={{ color: "text.secondary" }}>
                                Select status
                              </Box>
                            );
                          }
                          const opt = STATUS_OPTIONS.find((o) => o.value === selected);
                          return opt?.label ?? selected;
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box component='label' htmlFor='sale-date' sx={labelSx}>
                  Date
                </Box>
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
              </Box>
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
            {initialData ? "Update Sale" : "Save Sale"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
