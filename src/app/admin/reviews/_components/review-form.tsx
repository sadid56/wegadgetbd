"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControl as SelectFormControl, Select, MenuItem } from "@/components/ui/select";
import { CircularProgress } from "@/components/ui/spinner";
import { FileDropdown } from "@/components/ui/file-dropdown";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useCreateReview, useUpdateReview } from "@/query-client/reviews/index";
import { orpcClient } from "@/lib/orpc/client";
import { uploadFileToStorage, stripAssetDomain } from "@/lib/storage";
import { createAdminReviewInputSchema, type CreateAdminReviewInput } from "@/server/schemas/admin.schema";

type ReviewFormValues = CreateAdminReviewInput;

interface ReviewFormProps {
  initialData?: {
    id: string;
    customerName?: string;
    customerPic?: string | null;
    mediaUrl?: string | null;
    mediaType?: string | null;
    rating?: number;
    review?: string;
    status?: string;
    productId?: string | null;
  } | null;
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
            })),
          );
        }
      })
      .catch((err) => {
        console.error("Failed to load products for review form", err);
      });
  }, []);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(createAdminReviewInputSchema) as Resolver<ReviewFormValues>,
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
        status: (initialData.status as "PENDING" | "APPROVED" | "REJECTED") || "APPROVED",
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

  return (
    <Form {...form}>
      <Box
        component='form'
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pb: 2,
        }}
      >
        <FormField
          control={form.control}
          name='productId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product (Optional)</FormLabel>
              <FormControl>
                <SelectFormControl fullWidth size='small'>
                  <Select value={field.value || "none"} onChange={field.onChange}>
                    <MenuItem value='none'>No specific product</MenuItem>
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.title}
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
          name='customerName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <TextField placeholder='John Doe' fullWidth size='small' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Photo */}
        <Box>
          <Label sx={{ mb: 0.75, display: "block" }}>Profile Photo (Optional)</Label>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <FileDropdown
              value={picPreview}
              onFilesSelect={(files) => {
                const file = files[0];
                if (file) {
                  uploadFile(file, "reviews/pics", setUploadingPic, (url) => {
                    form.setValue("customerPic", url);
                    setPicPreview(url);
                  });
                }
              }}
              onRemove={() => {
                setPicPreview("");
                form.setValue("customerPic", "");
              }}
              uploading={uploadingPic}
              title='Drop profile photo or click to upload'
              subtitle='PNG, JPG, WEBP up to 5MB'
            />

            <FormField
              control={form.control}
              name='customerPic'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField
                      placeholder='Or paste image URL directly'
                      fullWidth
                      size='small'
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e);
                        setPicPreview(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
        </Box>

        {/* Review Media */}
        <Box>
          <Label sx={{ mb: 0.75, display: "block" }}>Review Photo / Video (Optional)</Label>
          <FileDropdown
            value={mediaPreview}
            accept='image/*,video/*'
            mediaType={mediaTypeState}
            onFilesSelect={(files) => {
              const file = files[0];
              if (file) {
                uploadFile(file, "reviews/media", setUploadingMedia, (url, type) => {
                  form.setValue("mediaUrl", url);
                  form.setValue("mediaType", type || "image");
                  setMediaPreview(url);
                  setMediaTypeState(type || "image");
                });
              }
            }}
            onRemove={() => {
              setMediaPreview("");
              setMediaTypeState("");
              form.setValue("mediaUrl", "");
              form.setValue("mediaType", "");
            }}
            uploading={uploadingMedia}
            title='Drop review photo or video, or click to upload'
            subtitle='JPG, PNG, MP4, MOV (max 50MB)'
          />
        </Box>

        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <FormControl>
                <TextField
                  type='number'
                  fullWidth
                  size='small'
                  slotProps={{ htmlInput: { min: 1, max: 5 } }}
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
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <SelectFormControl fullWidth size='small'>
                  <Select value={field.value || "APPROVED"} onChange={field.onChange}>
                    <MenuItem value='PENDING'>Pending</MenuItem>
                    <MenuItem value='APPROVED'>Approved</MenuItem>
                    <MenuItem value='REJECTED'>Rejected</MenuItem>
                  </Select>
                </SelectFormControl>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='review'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <TextField placeholder='Great product...' fullWidth multiline minRows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  );
}
