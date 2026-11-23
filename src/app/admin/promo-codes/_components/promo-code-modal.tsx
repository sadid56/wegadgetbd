"use client";

import { useEffect } from "react";
import { format, isValid } from "date-fns";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { FormControl as SelectFormControl, Select, MenuItem } from "@/components/ui/select";
import { Modal, ModalTitle, ModalContent, ModalActions } from "@/components/ui/modal";
import { DateTimePicker } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { tokens } from "@/theme/theme";
import type { PromoCodeItem } from "@/query-client/promo-codes";

export interface PromoCodePayload {
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  usageLimit: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

const promoModalSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Promo code must be at least 2 characters.")
      .max(40, "Promo code must be under 40 characters."),
    description: z.string().trim().max(255).optional().default(""),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.coerce.number().positive("Discount value must be greater than 0."),
    maxDiscountAmount: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
    minOrderAmount: z.coerce.number().min(0).default(0),
    usageLimit: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
    startsAt: z.string().optional().default(""),
    expiresAt: z.string().optional().default(""),
    isActive: z.boolean().default(true),
  })
  .superRefine((val, ctx) => {
    if (val.discountType === "PERCENTAGE" && val.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }
  });

type PromoFormValues = z.infer<typeof promoModalSchema>;

function toLocalDatetimeInput(val: Date | string | null | undefined): string {
  if (!val) return "";
  const date = new Date(val);
  return isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
}

function getInitialFormValues(editingPromo: PromoCodeItem | null): PromoFormValues {
  if (!editingPromo) {
    return {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      maxDiscountAmount: "",
      minOrderAmount: 0,
      usageLimit: "",
      startsAt: "",
      expiresAt: "",
      isActive: true,
    };
  }
  return {
    code: editingPromo.code,
    description: editingPromo.description || "",
    discountType: editingPromo.discountType,
    discountValue: editingPromo.discountValue,
    maxDiscountAmount: editingPromo.maxDiscountAmount != null ? editingPromo.maxDiscountAmount : "",
    minOrderAmount: editingPromo.minOrderAmount ?? 0,
    usageLimit: editingPromo.usageLimit != null ? editingPromo.usageLimit : "",
    startsAt: toLocalDatetimeInput(editingPromo.startsAt),
    expiresAt: toLocalDatetimeInput(editingPromo.expiresAt),
    isActive: editingPromo.isActive,
  };
}

interface PromoCodeModalProps {
  open: boolean;
  editingPromo: PromoCodeItem | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: PromoCodePayload) => Promise<void>;
}

export function PromoCodeModal({ open, editingPromo, isSaving, onClose, onSubmit }: PromoCodeModalProps) {
  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promoModalSchema) as Resolver<PromoFormValues>,
    defaultValues: getInitialFormValues(editingPromo),
  });

  useEffect(() => {
    if (open) {
      form.reset(getInitialFormValues(editingPromo));
    }
  }, [open, editingPromo, form]);

  const discountType = form.watch("discountType");

  const handleSave = async (values: PromoFormValues) => {
    await onSubmit({
      code: values.code.trim().toUpperCase(),
      description: values.description?.trim() || null,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      maxDiscountAmount:
        values.discountType === "PERCENTAGE" && values.maxDiscountAmount !== "" && values.maxDiscountAmount != null
          ? Number(values.maxDiscountAmount)
          : null,
      minOrderAmount: Number.isFinite(values.minOrderAmount) && values.minOrderAmount >= 0 ? values.minOrderAmount : 0,
      usageLimit:
        values.usageLimit !== "" && values.usageLimit != null && Number(values.usageLimit) > 0
          ? Number(values.usageLimit)
          : null,
      startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : null,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
      isActive: values.isActive,
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => !isSaving && onClose()}
      showCloseButton
      maxWidth='sm'
      fullWidth
    >
      <Form {...form}>
        <Box component='form' onSubmit={form.handleSubmit(handleSave)} sx={{ display: "flex", flexDirection: "column" }}>
          <ModalTitle sx={{ fontWeight: 800, fontSize: 18, pb: 1 }}>
            {editingPromo ? `Edit Promo Code (${editingPromo.code})` : "Create Promo Code"}
          </ModalTitle>
          <ModalContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code *</FormLabel>
                    <FormControl>
                      <TextField
                        size='small'
                        placeholder='e.g. EID20'
                        fullWidth
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discountType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type *</FormLabel>
                    <FormControl>
                      <SelectFormControl fullWidth size='small'>
                        <Select value={field.value} onChange={field.onChange}>
                          <MenuItem value='PERCENTAGE'>Percentage (%)</MenuItem>
                          <MenuItem value='FIXED'>Fixed Amount (৳)</MenuItem>
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <TextField
                      size='small'
                      placeholder='e.g. Eid Special 20% discount on all gadgets'
                      fullWidth
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <FormField
                control={form.control}
                name='discountValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {discountType === "PERCENTAGE" ? "Discount Percentage (%) *" : "Discount Amount (৳) *"}
                    </FormLabel>
                    <FormControl>
                      <TextField
                        size='small'
                        type='number'
                        placeholder={discountType === "PERCENTAGE" ? "20" : "200"}
                        fullWidth
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {discountType === "PERCENTAGE" ? (
                <FormField
                  control={form.control}
                  name='maxDiscountAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount Cap (৳)</FormLabel>
                      <FormControl>
                        <TextField
                          size='small'
                          type='number'
                          placeholder='500 (optional)'
                          fullWidth
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name='minOrderAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Amount (৳)</FormLabel>
                      <FormControl>
                        <TextField
                          size='small'
                          type='number'
                          placeholder='0'
                          fullWidth
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              {discountType === "PERCENTAGE" && (
                <FormField
                  control={form.control}
                  name='minOrderAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Amount (৳)</FormLabel>
                      <FormControl>
                        <TextField
                          size='small'
                          type='number'
                          placeholder='0'
                          fullWidth
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='usageLimit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit (Optional)</FormLabel>
                    <FormControl>
                      <TextField
                        size='small'
                        type='number'
                        placeholder='Leave blank for unlimited'
                        fullWidth
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <FormField
                control={form.control}
                name='startsAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starts At (Optional)</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder='Select start date & time'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='expiresAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At (Optional)</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder='Select expiry date & time'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: tokens.textPrimary }}>
                          Active (usable by customers)
                        </Typography>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </ModalContent>
          <ModalActions sx={{ pt: 1.5, gap: 1 }}>
            <Button type='button' variant='outline' onClick={onClose} disabled={isSaving} sx={{ whiteSpace: "nowrap" }}>
              Cancel
            </Button>
            <Button type='submit' variant='primary' loading={isSaving} sx={{ whiteSpace: "nowrap" }}>
              {editingPromo ? "Save Changes" : "Create Promo Code"}
            </Button>
          </ModalActions>
        </Box>
      </Form>
    </Modal>
  );
}
