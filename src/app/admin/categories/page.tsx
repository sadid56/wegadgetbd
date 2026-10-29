"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/query-client/categories";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function CategoriesPage() {
  const toast = useToast();
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      ...values,
      icon: values.icon ? stripAssetDomain(values.icon) : undefined,
    };
    if (editingId) {
      updateCategory(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            setIsOpen(false);
            setEditingId(null);
            form.reset();
          },
        },
      );
    } else {
      createCategory(payload, {
        onSuccess: () => {
          setIsOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    form.reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "",
    });
    setIsOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const { url } = await uploadFileToStorage({ file, folder: "categories" });
      form.setValue("icon", url);
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingId(null);
      form.reset({ name: "", slug: "", icon: "" });
    }
  };

  const watchedIcon = form.watch("icon");
  const isSubmitting = isCreating || isUpdating || uploading;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Categories
        </Typography>
        <Button
          variant='contained'
          disableElevation
          onClick={() => setIsOpen(true)}
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            borderRadius: "8px",
            height: 40,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* Create / Edit dialog */}
      <Dialog
        open={isOpen}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            handleOpenChange(false);
          }
        }}
        maxWidth='sm'
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: "12px" } },
        }}
      >
        <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
          <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{editingId ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              Manage your product categories here.
            </DialogContentText>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Name */}
              <Box>
                <Box
                  component='label'
                  htmlFor='category-name'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                    mb: 1,
                  }}
                >
                  Name
                </Box>
                <TextField
                  id='category-name'
                  fullWidth
                  size='small'
                  sx={inputSx}
                  {...form.register("name", {
                    onChange: (e) => {
                      if (!editingId && !form.getValues("slug")) {
                        form.setValue("slug", slugify(e.target.value));
                      }
                    },
                  })}
                  error={!!form.formState.errors.name}
                  helperText={form.formState.errors.name?.message}
                />
              </Box>

              {/* Slug */}
              <Box>
                <Box
                  component='label'
                  htmlFor='category-slug'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                    mb: 1,
                  }}
                >
                  Slug
                </Box>
                <TextField
                  id='category-slug'
                  fullWidth
                  size='small'
                  sx={inputSx}
                  {...form.register("slug")}
                  error={!!form.formState.errors.slug}
                  helperText={form.formState.errors.slug?.message}
                />
              </Box>

              {/* Image */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  component='label'
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  Image
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {watchedIcon && (
                    <Box
                      component='img'
                      src={getAssetUrl(watchedIcon)}
                      alt='Preview'
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "4px",
                        objectFit: "cover",
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Box sx={{ position: "relative" }}>
                    <Button
                      type='button'
                      variant='outlined'
                      size='small'
                      disabled={uploading}
                      startIcon={
                        uploading ? (
                          <CircularProgress size={14} sx={{ color: "inherit" }} />
                        ) : (
                          <UploadFileOutlinedIcon sx={{ fontSize: 16 }} />
                        )
                      }
                      sx={{
                        height: 36,
                        textTransform: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        borderRadius: "8px",
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: "text.disabled",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Upload
                    </Button>
                    <Box
                      component='input'
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      disabled={uploading}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              type='submit'
              variant='contained'
              disableElevation
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: "8px",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Table */}
      <TableContainer
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["Image", "Name", "Slug", "Products"].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    bgcolor: "action.hover",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 1.25,
                  }}
                >
                  {head}
                </TableCell>
              ))}
              <TableCell
                align='right'
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  bgcolor: "action.hover",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 1.25,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ height: 96, textAlign: "center" }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ) : categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((cat) => (
                <TableRow
                  key={cat.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>
                    {cat.icon ? (
                      <Box
                        component='img'
                        src={getAssetUrl(cat.icon)}
                        alt={cat.name}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "action.hover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "text.primary" }}>{cat.name}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{cat.slug}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{cat._count?.products || 0}</TableCell>
                  <TableCell align='right'>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <IconButton
                        size='small'
                        onClick={() => handleEdit(cat)}
                        aria-label='Edit category'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "text.secondary",
                          "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                        }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => handleDelete(cat.id)}
                        aria-label='Delete category'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "#ef4444",
                          "&:hover": { bgcolor: "rgba(239,68,68,0.1)", color: "#dc2626" },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation */}
      <Dialog
        open={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        maxWidth='xs'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary" }}>
            This action cannot be undone. This will permanently delete the category and may affect associated products.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setCategoryToDelete(null)}
            variant='outlined'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant='contained'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              bgcolor: "#dc2626",
              color: "#fff",
              "&:hover": { bgcolor: "#b91c1c" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
