"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { TextField, InputAdornment } from "@/components/ui/input";
import { FormControl, Select, MenuItem, FormControlLabel } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Chip } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/spinner";
import { Paper } from "@/components/ui/card";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

import { useCreateProduct, useUpdateProduct } from "@/query-client/products";
import { useCategories } from "@/query-client/categories";
import { useToast } from "@/context/toast-context";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";
import { normalizeVideoInput } from "@/lib/video-links";
import { tokens } from "@/theme/theme";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description is required"),
  markdown_description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  discountPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["PENDING", "ACTIVE", "INACTIVE"]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  featuredBanner: z.string().optional().nullable(),
  label: z.enum(["NONE", "NEW", "SPECIAL", "BEST_SELLER"]),
  specifications: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()),
  inStock: z.boolean().default(true),
  rating: z
    .string()
    .regex(/^\d+(\.\d{1})?$/, "Invalid rating format")
    .optional(),
  videoLinks: z.array(z.string()).max(2, "Maximum 2 video links allowed"),
  model: z.string().optional(),
  brand: z.string().optional(),
  whyBuyText: z.string().optional(),
  soldCount: z.coerce.number().min(0, "Sold count cannot be negative").default(360),
  messengerUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

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

const labelSx = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "text.primary",
  mb: 0.75,
} as const;

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { data: categories } = useCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          price: initialData.price.toString(),
          discountPrice: initialData.discountPrice?.toString() || "",
          images: initialData.images || [],
          featuredBanner: initialData.featuredBanner || null,
          label: initialData.label || "NONE",
          specifications: initialData.specifications || {},
          tags: initialData.tags || [],
          inStock: initialData.inStock ?? true,
          rating: initialData.rating?.toString() || "5.0",
          videoLinks: initialData.videoLinks || ["", ""],
          model: initialData.model || "",
          brand: initialData.brand || "",
          whyBuyText: initialData.whyBuyText || "",
          soldCount: Number(initialData.soldCount || 360),
          messengerUrl: initialData.messengerUrl || "",
          markdown_description: initialData.markdown_description || "",
        }
      : {
          title: "",
          slug: "",
          description: "",
          price: "",
          discountPrice: "",
          categoryId: "",
          status: "PENDING",
          images: [],
          featuredBanner: null,
          label: "NONE",
          specifications: {},
          tags: [],
          inStock: true,
          rating: "5.0",
          videoLinks: ["", ""],
          model: "",
          brand: "",
          whyBuyText: "",
          soldCount: 360,
          messengerUrl: "",
          markdown_description: "",
        },
  });

  const onSubmit = (values: ProductFormValues) => {
    const payload = {
      ...values,
      featuredBanner: values.featuredBanner ? stripAssetDomain(values.featuredBanner) : null,
      images: (values.images || []).map((img) => stripAssetDomain(img)),
      price: parseFloat(values.price),
      discountPrice: values.discountPrice ? parseFloat(values.discountPrice) : null,
      rating: parseFloat(values.rating || "5.0"),
      videoLinks: values.videoLinks?.map((link) => normalizeVideoInput(link)).filter((link) => link.trim() !== "") || [],
    };

    if (initialData) {
      updateProduct(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            router.push("/admin/products");
          },
          onError: (err: any) => {
            toast.error(err?.message || "Failed to update product");
          },
        },
      );
    } else {
      createProduct(payload, {
        onSuccess: () => {
          toast.success("Product created successfully");
          router.push("/admin/products");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to create product");
        },
      });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);

    try {
      const file = e.target.files[0];
      const { url } = await uploadFileToStorage({ file, folder: "banners" });
      form.setValue("featuredBanner", url);
      toast.success("Banner uploaded");
    } catch (error: any) {
      toast.error("Banner upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);

    try {
      const files = Array.from(e.target.files);
      const newImages = [...form.getValues("images")];

      for (const file of files) {
        const { url } = await uploadFileToStorage({ file, folder: "products" });
        newImages.push(url);
      }

      form.setValue("images", newImages);
      toast.success("Images uploaded");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,+|,+$/g, "");
      const currentTags = form.getValues("tags") || [];
      if (val && !currentTags.includes(val)) {
        form.setValue("tags", [...currentTags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = [...form.getValues("tags")];
    currentTags.splice(index, 1);
    form.setValue("tags", currentTags);
  };

  const isPending = isCreating || isUpdating || uploading;

  return (
    <Box component='form' onSubmit={form.handleSubmit(onSubmit as any)} sx={{ display: "flex", flexDirection: "column", gap: 3.5, width: "100%" }}>
      {/* Title & Slug */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Box>
          <Box component='label' htmlFor='title' sx={labelSx}>
            Name of the product *
          </Box>
          <Controller
            name='title'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                id='title'
                placeholder='Product title'
                fullWidth
                size='small'
                sx={inputSx}
                error={!!form.formState.errors.title}
                helperText={form.formState.errors.title?.message}
                onChange={(e) => {
                  field.onChange(e);
                  if (!initialData && !form.getValues("slug")) {
                    form.setValue(
                      "slug",
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "")
                    );
                  }
                }}
              />
            )}
          />
        </Box>

        <Box>
          <Box component='label' htmlFor='slug' sx={labelSx}>
            Slug (Optional)
          </Box>
          <Controller
            name='slug'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                id='slug'
                placeholder='unique-url-identifier'
                fullWidth
                size='small'
                sx={inputSx}
                error={!!form.formState.errors.slug}
                helperText={form.formState.errors.slug?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Category, Status, Label, Price, DiscountPrice */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(5, 1fr)" }, gap: 2.5 }}>
        {/* Category */}
        <Box>
          <Box component='label' sx={labelSx}>
            Category *
          </Box>
          <Controller
            name='categoryId'
            control={form.control}
            render={({ field }) => (
              <FormControl fullWidth size='small' error={!!form.formState.errors.categoryId}>
                <Select {...field} sx={inputSx}>
                  <MenuItem value='' disabled>
                    Select category
                  </MenuItem>
                  {categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: 14 }}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {form.formState.errors.categoryId && (
                  <Typography variant='caption' sx={{ color: "error.main", mt: 0.5 }}>
                    {form.formState.errors.categoryId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Box>

        {/* Status */}
        <Box>
          <Box component='label' sx={labelSx}>
            Status *
          </Box>
          <Controller
            name='status'
            control={form.control}
            render={({ field }) => (
              <FormControl fullWidth size='small'>
                <Select {...field} sx={inputSx}>
                  <MenuItem value='PENDING' sx={{ fontSize: 14 }}>Pending</MenuItem>
                  <MenuItem value='ACTIVE' sx={{ fontSize: 14 }}>Active</MenuItem>
                  <MenuItem value='INACTIVE' sx={{ fontSize: 14 }}>Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Label */}
        <Box>
          <Box component='label' sx={labelSx}>
            Label
          </Box>
          <Controller
            name='label'
            control={form.control}
            render={({ field }) => (
              <FormControl fullWidth size='small'>
                <Select {...field} sx={inputSx}>
                  <MenuItem value='NONE' sx={{ fontSize: 14 }}>None</MenuItem>
                  <MenuItem value='NEW' sx={{ fontSize: 14 }}>New Product</MenuItem>
                  <MenuItem value='SPECIAL' sx={{ fontSize: 14 }}>Special Product</MenuItem>
                  <MenuItem value='BEST_SELLER' sx={{ fontSize: 14 }}>Top Selling</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Price */}
        <Box>
          <Box component='label' htmlFor='price' sx={labelSx}>
            Main Price *
          </Box>
          <Controller
            name='price'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                id='price'
                type='number'
                placeholder='0.00'
                fullWidth
                size='small'
                sx={inputSx}
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!form.formState.errors.price}
                helperText={form.formState.errors.price?.message}
              />
            )}
          />
        </Box>

        {/* Discount Price */}
        <Box>
          <Box component='label' htmlFor='discountPrice' sx={labelSx}>
            Discount Price
          </Box>
          <Controller
            name='discountPrice'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                id='discountPrice'
                type='number'
                placeholder='0.00'
                fullWidth
                size='small'
                sx={inputSx}
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!form.formState.errors.discountPrice}
                helperText={form.formState.errors.discountPrice?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Brand, Model, Rating */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
        <Box>
          <Box component='label' sx={labelSx}>
            Brand
          </Box>
          <Controller
            name='brand'
            control={form.control}
            render={({ field }) => (
              <TextField {...field} placeholder='Brand name' fullWidth size='small' sx={inputSx} />
            )}
          />
        </Box>

        <Box>
          <Box component='label' sx={labelSx}>
            Model
          </Box>
          <Controller
            name='model'
            control={form.control}
            render={({ field }) => (
              <TextField {...field} placeholder='Model name/number' fullWidth size='small' sx={inputSx} />
            )}
          />
        </Box>

        <Box>
          <Box component='label' sx={labelSx}>
            Rating (0 - 5)
          </Box>
          <Controller
            name='rating'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                type='number'
                placeholder='5.0'
                fullWidth
                size='small'
                sx={inputSx}
                slotProps={{ htmlInput: { step: "0.1", min: "0", max: "5" } }}
                error={!!form.formState.errors.rating}
                helperText={form.formState.errors.rating?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Sold count, Messenger URL */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 2.5 }}>
        <Box>
          <Box component='label' sx={labelSx}>
            Sold Count
          </Box>
          <Controller
            name='soldCount'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                type='number'
                placeholder='360'
                fullWidth
                size='small'
                sx={inputSx}
                slotProps={{ htmlInput: { min: "0" } }}
                error={!!form.formState.errors.soldCount}
                helperText={form.formState.errors.soldCount?.message || "Used in product CTA button"}
              />
            )}
          />
        </Box>

        <Box>
          <Box component='label' sx={labelSx}>
            Messenger URL
          </Box>
          <Controller
            name='messengerUrl'
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder='https://m.me/your-page'
                fullWidth
                size='small'
                sx={inputSx}
                helperText="Used by 'Talk to Us' section on product page"
              />
            )}
          />
        </Box>
      </Box>

      {/* Stock Availability */}
      <Paper variant='outlined' sx={{ p: 2, borderRadius: "10px", borderColor: "divider" }}>
        <Controller
          name='inStock'
          control={form.control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color='primary' />}
              label={
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Stock Availability</Typography>
                  <Typography variant='caption' sx={{ color: "text.secondary" }}>
                    Whether this product is currently available or out of stock
                  </Typography>
                </Box>
              }
              sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
            />
          )}
        />
      </Paper>

      {/* Video Links */}
      <Box>
        <Box component='label' sx={labelSx}>
          Product Videos (Up to 2 YouTube/Facebook links)
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          {[0, 1].map((index) => (
            <Controller
              key={index}
              name={`videoLinks.${index}` as any}
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder={`Video link ${index + 1}`}
                  fullWidth
                  size='small'
                  sx={inputSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <VideocamOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          ))}
        </Box>
      </Box>

      {/* Why Buy Text */}
      <Box>
        <Box component='label' sx={labelSx}>
          Why Buy Text (Product Page)
        </Box>
        <Controller
          name='whyBuyText'
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={3}
              placeholder='Explain why this product is worth buying...'
              fullWidth
              size='small'
              sx={inputSx}
              helperText="This appears in the 'Why Buy [Product Name]?' section."
            />
          )}
        />
      </Box>

      {/* Description */}
      <Box>
        <Box component='label' sx={labelSx}>
          Short Description *
        </Box>
        <Controller
          name='description'
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={4}
              placeholder='Product description'
              fullWidth
              size='small'
              sx={inputSx}
              error={!!form.formState.errors.description}
              helperText={form.formState.errors.description?.message}
            />
          )}
        />
      </Box>

      {/* Tags */}
      <Box>
        <Box component='label' sx={labelSx}>
          Tags (Keywords for search)
        </Box>
        <Controller
          name='tags'
          control={form.control}
          render={({ field }) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(field.value || []).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size='small'
                    onDelete={() => handleRemoveTag(idx)}
                    sx={{
                      borderRadius: "6px",
                      bgcolor: "action.hover",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
              <TextField
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder='Add tag and press Enter or comma'
                fullWidth
                size='small'
                sx={inputSx}
                helperText='Press Enter or comma to add each tag'
              />
            </Box>
          )}
        />
      </Box>

      {/* Hero Banner */}
      <Box>
        <Box component='label' sx={labelSx}>
          Hero Banner (HD - 16:9 or 21:9)
        </Box>
        {form.watch("featuredBanner") ? (
          <Box sx={{ position: "relative", width: "100%", maxHeight: 220, borderRadius: "10px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
            <Box
              component='img'
              src={getAssetUrl(form.watch("featuredBanner"))}
              alt='Hero Banner'
              sx={{ width: "100%", maxHeight: 220, objectFit: "cover" }}
            />
            <IconButton
              size='small'
              onClick={() => form.setValue("featuredBanner", null)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: tokens.danger,
                color: tokens.textWhite,
                "&:hover": { bgcolor: tokens.dangerHover },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          <Box
            component='label'
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              borderRadius: "10px",
              border: "2px dashed",
              borderColor: "divider",
              bgcolor: "action.hover",
              cursor: uploading ? "not-allowed" : "pointer",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            {uploading ? (
              <CircularProgress size={24} sx={{ color: "primary.main" }} />
            ) : (
              <>
                <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}>
                  Upload Hero Banner
                </Typography>
              </>
            )}
            <input type='file' accept='image/*' hidden onChange={handleBannerUpload} disabled={uploading} />
          </Box>
        )}
      </Box>

      {/* Images */}
      <Box>
        <Box component='label' sx={labelSx}>
          Images (Thumbnail and Gallery) *
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1.5 }}>
          {form.watch("images")?.map((url, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: idx === 0 ? "primary.main" : "divider",
              }}
            >
              <Box component='img' src={getAssetUrl(url)} alt={`img-${idx}`} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <IconButton
                size='small'
                onClick={() => {
                  const updated = [...form.getValues("images")];
                  updated.splice(idx, 1);
                  form.setValue("images", updated);
                }}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: tokens.bgOverlay,
                  color: tokens.textWhite,
                  p: 0.5,
                  "&:hover": { bgcolor: tokens.danger },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
              {idx === 0 && (
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                    fontSize: 10,
                    textAlign: "center",
                    py: 0.25,
                    fontWeight: 700,
                  }}
                >
                  Thumbnail
                </Typography>
              )}
            </Box>
          ))}

          <Box
            component='label'
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: "8px",
              border: "2px dashed",
              borderColor: "divider",
              bgcolor: "action.hover",
              cursor: uploading ? "not-allowed" : "pointer",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            {uploading ? (
              <CircularProgress size={20} sx={{ color: "primary.main" }} />
            ) : (
              <>
                <CloudUploadOutlinedIcon sx={{ fontSize: 24, color: "text.secondary" }} />
                <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>Upload</Typography>
              </>
            )}
            <input type='file' accept='image/*' multiple hidden onChange={handleImageUpload} disabled={uploading} />
          </Box>
        </Box>
        {form.formState.errors.images && (
          <Typography variant='caption' sx={{ color: "error.main" }}>
            {form.formState.errors.images.message}
          </Typography>
        )}
      </Box>

      {/* Markdown Description */}
      <Box>
        <Box component='label' sx={labelSx}>
          Markdown Description (Optional)
        </Box>
        <Typography variant='caption' sx={{ color: "text.secondary", display: "block", mb: 1 }}>
          Rich text description using markdown format
        </Typography>
        <Box data-color-mode='dark' sx={{ borderRadius: "8px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          <MDEditor
            value={form.watch("markdown_description")}
            onChange={(v) => form.setValue("markdown_description", v ?? "")}
            height={400}
          />
        </Box>
      </Box>

      {/* Submit / Cancel Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
        <Button
          type='button'
          variant='outlined'
          onClick={() => router.back()}
          disabled={isPending}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "divider",
            color: "text.primary",
            px: 3,
            "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" },
          }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='contained'
          disableElevation
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            px: 3,
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </Box>
    </Box>
  );
}
