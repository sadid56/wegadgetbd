"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

import { useCreateReview, useUpdateReview } from "@/query-client/reviews/index";
import { getProductsForSelect } from "@/actions/reviews";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";

const reviewSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPic: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(1, "Review text is required"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  productId: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  initialData?: any;
  onSuccess: () => void;
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
    getProductsForSelect().then((res) => {
      if (res.success) setProducts(res.data || []);
    });
  }, []);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema) as any,
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
        <Box component='label' htmlFor='review-product' sx={labelSx}>
          Product (Optional)
        </Box>
        <Controller
          name='productId'
          control={form.control}
          render={({ field }) => (
            <FormControl fullWidth size='small'>
              <Select
                id='review-product'
                value={field.value || ""}
                onChange={field.onChange}
                displayEmpty
                sx={selectSx}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Box component='span' sx={{ color: "text.secondary" }}>
                        Select a product
                      </Box>
                    );
                  }
                  if (selected === "none") return "No specific product";
                  const p = products.find((x) => x.id === selected);
                  return p?.title ?? "Select a product";
                }}
              >
                <MenuItem value='none' sx={{ fontSize: 14 }}>
                  No specific product
                </MenuItem>
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id} sx={{ fontSize: 14 }}>
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
        <Box component='label' htmlFor='review-customer-name' sx={labelSx}>
          Customer Name
        </Box>
        <TextField
          id='review-customer-name'
          placeholder='John Doe'
          fullWidth
          size='small'
          inputRef={nameRef}
          {...nameProps}
          sx={inputSx}
          error={!!form.formState.errors.customerName}
          helperText={form.formState.errors.customerName?.message}
        />
      </Box>

      {/* Profile Photo */}
      <Box>
        <Box component='label' sx={labelSx}>
          Profile Photo (Optional)
        </Box>
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
                borderColor: "#34d399",
                bgcolor: "rgba(16,185,129,0.05)",
              },
            }}
          >
            {uploadingPic ? (
              <CircularProgress size={16} sx={{ color: "#10b981" }} />
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
                  borderColor: "#a7f3d0",
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
                  bgcolor: "#ef4444",
                  color: "#fff",
                  "&:hover": { bgcolor: "#dc2626" },
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
                sx={inputSx}
                slotProps={{ input: { sx: { fontSize: 12 } } }}
              />
            )}
          />
        </Box>
      </Box>

      {/* Review Media */}
      <Box>
        <Box component='label' sx={labelSx}>
          Review Photo / Video (Optional)
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            onClick={() => mediaRef.current?.click()}
            sx={{
              border: "2px dashed",
              borderColor: "#bfdbfe",
              borderRadius: "12px",
              p: 1.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 200ms",
              "&:hover": {
                borderColor: "#60a5fa",
                bgcolor: "rgba(59,130,246,0.05)",
              },
            }}
          >
            {uploadingMedia ? (
              <CircularProgress size={16} sx={{ color: "#3b82f6" }} />
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
                  bgcolor: "#ef4444",
                  color: "#fff",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#dc2626" },
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
        <Box component='label' htmlFor='review-rating' sx={labelSx}>
          Rating (1-5)
        </Box>
        <TextField
          id='review-rating'
          type='number'
          fullWidth
          size='small'
          inputRef={ratingRef}
          {...ratingProps}
          sx={inputSx}
          slotProps={{ htmlInput: { min: 1, max: 5 } }}
          error={!!form.formState.errors.rating}
          helperText={form.formState.errors.rating?.message}
        />
      </Box>

      {/* Status */}
      <Box>
        <Box component='label' htmlFor='review-status' sx={labelSx}>
          Status
        </Box>
        <Controller
          name='status'
          control={form.control}
          render={({ field }) => (
            <FormControl fullWidth size='small'>
              <Select
                id='review-status'
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
                  const labels: Record<string, string> = {
                    PENDING: "Pending",
                    APPROVED: "Approved",
                    REJECTED: "Rejected",
                  };
                  return labels[selected] ?? selected;
                }}
              >
                <MenuItem value='PENDING' sx={{ fontSize: 14 }}>
                  Pending
                </MenuItem>
                <MenuItem value='APPROVED' sx={{ fontSize: 14 }}>
                  Approved
                </MenuItem>
                <MenuItem value='REJECTED' sx={{ fontSize: 14 }}>
                  Rejected
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* Review Text */}
      <Box>
        <Box component='label' htmlFor='review-text' sx={labelSx}>
          Review
        </Box>
        <TextField
          id='review-text'
          placeholder='Great product...'
          fullWidth
          multiline
          minRows={4}
          inputRef={reviewRef}
          {...reviewProps}
          sx={{
            ...inputSx,
            "& .MuiOutlinedInput-root": {
              ...inputSx["& .MuiOutlinedInput-root"],
              py: 1,
            },
            "& .MuiOutlinedInput-input": { paddingTop: "8px !important" },
          }}
          error={!!form.formState.errors.review}
          helperText={form.formState.errors.review?.message}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          type='submit'
          variant='contained'
          disableElevation
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
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
          {initialData ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}
