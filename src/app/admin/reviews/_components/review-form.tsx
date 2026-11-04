"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControl, Select, MenuItem } from "@/components/ui/select";
import { IconButton } from "@/components/ui/icon-button";
import { CircularProgress } from "@/components/ui/spinner";

import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

import { useCreateReview, useUpdateReview } from "@/query-client/reviews/index";
import { orpcClient } from "@/lib/orpc/client";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";
import { tokens } from "@/theme/theme";
import { createAdminReviewInputSchema, type CreateAdminReviewInput } from "@/server/schemas/admin.schema";

type ReviewFormValues = CreateAdminReviewInput;

interface ReviewFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function ReviewForm({ initialData, onSuccess }: ReviewFormProps) {
  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();

  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [picPreview, setPicPreview] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaTypeState, setMediaTypeState] = useState("");

  const picRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const isPending = isCreating || isUpdating || uploadingPic || uploadingMedia;

  useEffect(() => {
    orpcClient.products
      .list({ limit: 100 })
      .then((res) => {
        if (res?.products) {
          setProducts(
            res.products.map((p) => ({
              id: p.id,
              title: p.title,
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Failed to load products for review form", err);
      });
  }, []);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(createAdminReviewInputSchema) as any,
    defaultValues: {
      customerName: "",
      customerPic: "",
      mediaUrl: "",
      mediaType: "",
      rating: 5,
      review: "",
      status: "APPROVED",
      productId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        customerName: initialData.customerName,
        customerPic: initialData.customerPic || "",
        mediaUrl: initialData.mediaUrl || "",
        mediaType: initialData.mediaType || "",
        rating: initialData.rating,
        review: initialData.review,
        status: initialData.status,
        productId: initialData.productId || "",
      });
      setPicPreview(initialData.customerPic || "");
      setMediaPreview(initialData.mediaUrl || "");
      setMediaTypeState(initialData.mediaType || "");
    }
  }, [initialData, form]);

  const uploadFile = async (
    file: File,
    folder: string,
    setUploading: (v: boolean) => void,
    onDone: (url: string, type?: string) => void,
  ) => {
    setUploading(true);
    try {
      const { url } = await uploadFileToStorage({ file, folder });
      const type = file.type.startsWith("video") ? "video" : "image";
      onDone(url, type);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ReviewFormValues) => {
    const payload = {
      ...data,
      customerPic: data.customerPic ? stripAssetDomain(data.customerPic) : undefined,
      productId: data.productId === "none" || !data.productId ? undefined : data.productId,
      mediaUrl: data.mediaUrl ? stripAssetDomain(data.mediaUrl) : undefined,
      mediaType: data.mediaType || undefined,
    };

    const resetForm = () => {
      form.reset();
      setPicPreview("");
      setMediaPreview("");
      setMediaTypeState("");
      onSuccess();
    };

    if (initialData) {
      updateReview({ id: initialData.id, data: payload }, { onSuccess: resetForm });
    } else {
      createReview(payload, { onSuccess: resetForm });
    }
  };

  const { ref: nameRef, ...nameProps } = form.register("customerName");
  const { ref: reviewRef, ...reviewProps } = form.register("review");
  const { ref: ratingRef, ...ratingProps } = form.register("rating");

  return (
    <Box
      component='form'
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxHeight: "80vh",
        overflowY: "auto",
        pr: 1,
        pb: 2,
      }}
    >
      {/* Product */}
      <Box>
        <Label htmlFor='review-product'>Product (Optional)</Label>
        <Controller
          name='productId'
          control={form.control}
          render={({ field }) => (
            <FormControl fullWidth size='small'>
              <Select
                id='review-product'
                value={field.value || "none"}
                onChange={field.onChange}
              >
                <MenuItem value='none'>No specific product</MenuItem>
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* Customer Name */}
      <Box>
        <Label htmlFor='review-customer-name'>Customer Name</Label>
        <TextField
          id='review-customer-name'
          placeholder='John Doe'
          fullWidth
          size='small'
          inputRef={nameRef}
          {...nameProps}
          error={!!form.formState.errors.customerName}
          helperText={form.formState.errors.customerName?.message}
        />
      </Box>

      {/* Profile Photo */}
      <Box>
        <Label>Profile Photo (Optional)</Label>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            onClick={() => picRef.current?.click()}
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: "12px",
              p: 1.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 200ms",
              "&:hover": {
                borderColor: tokens.accent,
                bgcolor: tokens.primarySubtle,
              },
            }}
          >
            {uploadingPic ? (
              <CircularProgress size={16} sx={{ color: tokens.primary }} />
            ) : (
              <ImageOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            )}
            <Box component='span' sx={{ fontSize: 14, color: "text.secondary" }}>
              {uploadingPic ? "Uploading..." : "Upload profile photo"}
            </Box>
            <Box
              component='input'
              ref={picRef}
              type='file'
              accept='image/*'
              sx={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file)
                  uploadFile(file, "reviews/pics", setUploadingPic, (url) => {
                    form.setValue("customerPic", url);
                    setPicPreview(url);
                  });
              }}
            />
          </Box>

          {picPreview && (
            <Box sx={{ position: "relative", width: 64, height: 64 }}>
              <Box
                component='img'
                src={getAssetUrl(picPreview)}
                alt='pic'
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid",
                  borderColor: tokens.primaryBorder,
                }}
              />
              <IconButton
                type='button'
                size='small'
                onClick={() => {
                  setPicPreview("");
                  form.setValue("customerPic", "");
                }}
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  bgcolor: tokens.danger,
                  color: tokens.textWhite,
                  "&:hover": { bgcolor: tokens.dangerHover },
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          )}

          <Controller
            name='customerPic'
            control={form.control}
            render={({ field }) => (
              <TextField
                placeholder='Or paste image URL directly'
                fullWidth
                size='small'
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  setPicPreview(e.target.value);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
        </Box>
      </Box>

      {/* Review Media */}
      <Box>
        <Label>Review Photo / Video (Optional)</Label>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            onClick={() => mediaRef.current?.click()}
            sx={{
              border: "2px dashed",
              borderColor: tokens.infoBorder,
              borderRadius: "12px",
              p: 1.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 200ms",
              "&:hover": {
                borderColor: tokens.info,
                bgcolor: tokens.infoSubtle,
              },
            }}
          >
            {uploadingMedia ? (
              <CircularProgress size={16} sx={{ color: tokens.info }} />
            ) : (
              <VideocamOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            )}
            <Box>
              <Box component='p' sx={{ fontSize: 14, color: "text.secondary", m: 0 }}>
                {uploadingMedia ? "Uploading..." : "Upload image or video"}
              </Box>
              <Box component='p' sx={{ fontSize: 12, color: "text.disabled", m: 0, mt: 0.25 }}>
                JPG, PNG, MP4, MOV (max 50MB)
              </Box>
            </Box>
            <Box
              component='input'
              ref={mediaRef}
              type='file'
              accept='image/*,video/*'
              sx={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file)
                  uploadFile(file, "reviews/media", setUploadingMedia, (url, type) => {
                    form.setValue("mediaUrl", url);
                    form.setValue("mediaType", type || "image");
                    setMediaPreview(url);
                    setMediaTypeState(type || "image");
                  });
              }}
            />
          </Box>

          {mediaPreview && (
            <Box
              sx={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {mediaTypeState === "video" ? (
                <Box
                  component='video'
                  src={getAssetUrl(mediaPreview)}
                  controls
                  sx={{ width: "100%", maxHeight: 192, objectFit: "cover", display: "block" }}
                />
              ) : (
                <Box
                  component='img'
                  src={getAssetUrl(mediaPreview)}
                  alt='media'
                  sx={{ width: "100%", maxHeight: 192, objectFit: "cover", display: "block" }}
                />
              )}
              <IconButton
                type='button'
                size='small'
                onClick={() => {
                  setMediaPreview("");
                  setMediaTypeState("");
                  form.setValue("mediaUrl", "");
                  form.setValue("mediaType", "");
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 24,
                  height: 24,
                  bgcolor: tokens.danger,
                  color: tokens.textWhite,
                  boxShadow: 2,
                  "&:hover": { bgcolor: tokens.dangerHover },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Rating */}
      <Box>
        <Label htmlFor='review-rating'>Rating (1-5)</Label>
        <TextField
          id='review-rating'
          type='number'
          fullWidth
          size='small'
          inputRef={ratingRef}
          {...ratingProps}
          slotProps={{ htmlInput: { min: 1, max: 5 } }}
          error={!!form.formState.errors.rating}
          helperText={form.formState.errors.rating?.message}
        />
      </Box>

      {/* Status */}
      <Box>
        <Label htmlFor='review-status'>Status</Label>
        <Controller
          name='status'
          control={form.control}
          render={({ field }) => (
            <FormControl fullWidth size='small'>
              <Select
                id='review-status'
                value={field.value || "APPROVED"}
                onChange={field.onChange}
              >
                <MenuItem value='PENDING'>Pending</MenuItem>
                <MenuItem value='APPROVED'>Approved</MenuItem>
                <MenuItem value='REJECTED'>Rejected</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* Review Text */}
      <Box>
        <Label htmlFor='review-text'>Review</Label>
        <TextField
          id='review-text'
          placeholder='Great product...'
          fullWidth
          multiline
          minRows={4}
          inputRef={reviewRef}
          {...reviewProps}
          error={!!form.formState.errors.review}
          helperText={form.formState.errors.review?.message}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          type='submit'
          variant='primary'
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
        >
          {initialData ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}
