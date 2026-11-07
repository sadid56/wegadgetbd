"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { TextField, InputAdornment } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControl, Select, MenuItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AddIcon from "@mui/icons-material/Add";

import { useCreateProduct, useUpdateProduct } from "@/query-client/products";
import { useAdminCategories } from "@/query-client/categories";
import { useToast } from "@/context/toast-context";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";
import { normalizeVideoInput } from "@/lib/video-links";
import { slugify } from "@/lib/utils";
import { tokens } from "@/theme/theme";
import { createProductInputSchema, type CreateProductInput } from "@/server/schemas/products.schema";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type ProductFormValues = CreateProductInput;

interface ProductFormProps {
  initialData?: any;
}

export const COMMON_GADGET_ATTRIBUTES = [
  "Motor Speed / RPM",
  "Battery Capacity",
  "Battery Life",
  "Charging Port",
  "Charging Time",
  "Waterproof Standard",
  "Screen Display",
  "Screen Resolution",
  "Connectivity",
  "Bluetooth Version",
  "Build Material",
  "Dimensions",
  "Weight",
  "Power / Wattage",
  "Wind Speed",
  "Noise Level",
  "Suction Power",
  "Input Voltage",
  "Output Power",
  "Compatible OS",
  "Package Contents",
];

const parseInitialSpecifications = (raw: any): { id: string; key: string; value: string }[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((s: any) => s && (s.key || s.value))
      .map((s: any) => ({
        id: crypto.randomUUID(),
        key: String(s.key || ""),
        value: String(s.value || ""),
      }));
  }
  if (typeof raw === "object") {
    return Object.entries(raw).map(([key, value]) => ({
      id: crypto.randomUUID(),
      key,
      value: String(value || ""),
    }));
  }
  return [];
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { data: categories } = useAdminCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [specsList, setSpecsList] = useState<{ id: string; key: string; value: string }[]>(() =>
    parseInitialSpecifications(initialData?.specifications)
  );

  useEffect(() => {
    if (initialData?.specifications) {
      setSpecsList(parseInitialSpecifications(initialData.specifications));
    }
  }, [initialData?.specifications]);

  const handleAddAttributeRow = () => {
    setSpecsList((prev) => [...prev, { id: crypto.randomUUID(), key: "", value: "" }]);
  };

  const handleAddSuggestedAttribute = (attrName: string) => {
    if (specsList.some((s) => s.key.toLowerCase() === attrName.toLowerCase())) {
      toast.info(`"${attrName}" is already in the list.`);
      return;
    }
    setSpecsList((prev) => [...prev, { id: crypto.randomUUID(), key: attrName, value: "" }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecKeyChange = (index: number, newKey: string) => {
    setSpecsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, key: newKey } : item))
    );
  };

  const handleSpecValueChange = (index: number, newValue: string) => {
    setSpecsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value: newValue } : item))
    );
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductInputSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          price: initialData.price ? Number(initialData.price) : ("" as any),
          discountPrice: initialData.discountPrice != null ? Number(initialData.discountPrice) : ("" as any),
          images: initialData.images || [],
          specifications: initialData.specifications || {},
          tags: initialData.tags || [],
          inStock: initialData.inStock ?? true,
          rating: Number(initialData.rating || 5),
          videoLinks: initialData.videoLinks || ["", ""],
          soldCount: Number(initialData.soldCount || 360),
          markdown_description: initialData.markdown_description || "",
        }
      : {
          title: "",
          slug: "",
          price: "" as any,
          discountPrice: "" as any,
          categoryId: "",
          status: "PENDING",
          images: [],
          specifications: {},
          tags: [],
          inStock: true,
          rating: 5,
          videoLinks: ["", ""],
          soldCount: 360,
          markdown_description: "",
        },
  });

  const onSubmit = (values: ProductFormValues) => {
    const validSpecs = specsList
      .filter((s) => s.key.trim() && s.value.trim())
      .map((s) => ({ key: s.key.trim(), value: s.value.trim() }));

    const payload = {
      ...values,
      specifications: validSpecs,
      images: (values.images || []).map((img) => stripAssetDomain(img)),
      videoLinks: values.videoLinks?.map((link) => normalizeVideoInput(link)).filter((link) => link && link.trim() !== "") || [],
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
    <Box
      component='form'
      onSubmit={form.handleSubmit(onSubmit as any)}
      sx={{ display: "flex", flexDirection: "column", gap: 3.5, width: "100%" }}
    >
      {/* Title & Slug */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Box>
          <Label htmlFor='title' sx={{ mb: 0.75, display: "block" }}>
            Name of the product *
          </Label>
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
                error={!!form.formState.errors.title}
                helperText={form.formState.errors.title?.message}
                onChange={(e) => {
                  field.onChange(e);
                  if (!initialData && !form.formState.dirtyFields.slug) {
                    form.setValue("slug", slugify(e.target.value));
                  }
                }}
              />
            )}
          />
        </Box>

        <Box>
          <Label htmlFor='slug' sx={{ mb: 0.75, display: "block" }}>
            Slug (Optional)
          </Label>
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
                error={!!form.formState.errors.slug}
                helperText={form.formState.errors.slug?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Category, Status, Price, DiscountPrice */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2.5 }}>
        {/* Category */}
        <Box>
          <Label sx={{ mb: 0.75, display: "block" }}>
            Category *
          </Label>
          <Controller
            name='categoryId'
            control={form.control}
            render={({ field }) => (
              <FormControl fullWidth size='small' error={!!form.formState.errors.categoryId}>
                <Select {...field}>
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
          <Label sx={{ mb: 0.75, display: "block" }}>
            Status *
          </Label>
          <Controller
            name='status'
            control={form.control}
            render={({ field }) => (
              <FormControl fullWidth size='small'>
                <Select {...field}>
                  <MenuItem value='PENDING' sx={{ fontSize: 14 }}>
                    Pending
                  </MenuItem>
                  <MenuItem value='ACTIVE' sx={{ fontSize: 14 }}>
                    Active
                  </MenuItem>
                  <MenuItem value='INACTIVE' sx={{ fontSize: 14 }}>
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Price */}
        <Box>
          <Label htmlFor='price' sx={{ mb: 0.75, display: "block" }}>
            Main Price *
          </Label>
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
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!form.formState.errors.price}
                helperText={form.formState.errors.price?.message}
              />
            )}
          />
        </Box>

        {/* Discount Price */}
        <Box>
          <Label htmlFor='discountPrice' sx={{ mb: 0.75, display: "block" }}>
            Discount Price
          </Label>
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
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!form.formState.errors.discountPrice}
                helperText={form.formState.errors.discountPrice?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Rating & Sold count */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
        <Box>
          <Label sx={{ mb: 0.75, display: "block" }}>
            Rating (0 - 5)
          </Label>
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
                slotProps={{ htmlInput: { step: "0.1", min: "0", max: "5" } }}
                error={!!form.formState.errors.rating}
                helperText={form.formState.errors.rating?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Label sx={{ mb: 0.75, display: "block" }}>
            Sold Count
          </Label>
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
                slotProps={{ htmlInput: { min: "0" } }}
                error={!!form.formState.errors.soldCount}
                helperText={form.formState.errors.soldCount?.message || "Used in product CTA button"}
              />
            )}
          />
        </Box>
      </Box>

      {/* Dynamic Key Attributes & Technical Specifications */}
      <Card sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
              Key Attributes & Technical Specifications
            </Typography>
            <Typography variant='caption' sx={{ color: "text.secondary", display: "block" }}>
              Add custom attributes for this gadget without restrictions. These appear directly in the Alibaba-style Key Attributes table.
            </Typography>
          </Box>
          <Button
            type='button'
            variant='primary'
            size='small'
            onClick={handleAddAttributeRow}
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          >
            Add Attribute
          </Button>
        </Box>

        {/* Suggestion Chips */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", pt: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mr: 0.5 }}>
            Quick Suggestions:
          </Typography>
          {COMMON_GADGET_ATTRIBUTES.map((attr) => (
            <Chip
              key={attr}
              label={`+ ${attr}`}
              size='small'
              onClick={() => handleAddSuggestedAttribute(attr)}
              variant='outlined'
              sx={{ cursor: "pointer", fontSize: 11.5, "&:hover": { bgcolor: "action.hover" } }}
            />
          ))}
        </Box>

        {/* Dynamic Key-Value Rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 0.5 }}>
          {specsList.map((spec, index) => (
            <Box
              key={spec.id}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" },
                gap: 1.5,
                alignItems: "center",
                p: 1.25,
                bgcolor: "action.hover",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Autocomplete
                freeSolo
                options={COMMON_GADGET_ATTRIBUTES}
                value={spec.key}
                onInputChange={(_, newValue) => handleSpecKeyChange(index, newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Attribute Name (e.g. Motor Speed)'
                    size='small'
                    fullWidth
                  />
                )}
              />

              <TextField
                placeholder='Attribute Value (e.g. 150,000 RPM)'
                size='small'
                fullWidth
                value={spec.value}
                onChange={(e) => handleSpecValueChange(index, e.target.value)}
              />

              <IconButton
                size='small'
                onClick={() => handleRemoveSpecRow(index)}
                sx={{
                  color: "error.main",
                  p: 0.75,
                  "&:hover": { bgcolor: "error.lighter" },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ))}

          {specsList.length === 0 && (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: "8px",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                No custom specifications added yet. Click &quot;Add Attribute&quot; or choose from quick suggestions above.
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Stock Availability */}
      <Card sx={{ p: 2 }}>
        <Controller
          name='inStock'
          control={form.control}
          render={({ field }) => (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Stock Availability</Typography>
                <Typography variant='caption' sx={{ color: "text.secondary", display: "block", mt: 0.25 }}>
                  {field.value
                    ? "In Stock — product is currently available for purchase"
                    : "Out of Stock — product is marked as unavailable"}
                </Typography>
              </Box>
              <Switch checked={Boolean(field.value)} onCheckedChange={(val) => field.onChange(val)} />
            </Box>
          )}
        />
      </Card>

      {/* Video Links */}
      <Box>
        <Label sx={{ mb: 0.75, display: "block" }}>
          Product Videos (Up to 2 YouTube/Facebook links)
        </Label>
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

      {/* Tags */}
      <Box>
        <Label sx={{ mb: 0.75, display: "block" }}>
          Tags (Keywords for search)
        </Label>
        <Controller
          name='tags'
          control={form.control}
          render={({ field }) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(field.value || []).map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant='secondary'
                    onDelete={() => handleRemoveTag(idx)}
                  >
                    {tag}
                  </Badge>
                ))}
              </Box>
              <TextField
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder='Add tag and press Enter or comma'
                fullWidth
                size='small'
                helperText='Press Enter or comma to add each tag'
              />
            </Box>
          )}
        />
      </Box>

      {/* Images */}
      <Box>
        <Label sx={{ mb: 0.75, display: "block" }}>
          Images (Thumbnail and Gallery) *
        </Label>
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
        <Label sx={{ mb: 0.75, display: "block" }}>
          Markdown Description (Optional)
        </Label>
        <Typography variant='caption' sx={{ color: "text.secondary", display: "block", mb: 1 }}>
          Rich text description using markdown format
        </Typography>
        <Box data-color-mode='dark' sx={{ borderRadius: "8px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          <MDEditor
            value={form.watch("markdown_description") || ""}
            onChange={(v) => form.setValue("markdown_description", v ?? "")}
            height={400}
          />
        </Box>
      </Box>

      {/* Submit / Cancel Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          disabled={isPending}
          sx={{ px: 3 }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='primary'
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
          sx={{ px: 3 }}
        >
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </Box>
    </Box>
  );
}
