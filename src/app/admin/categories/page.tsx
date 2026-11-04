"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Button,
  TextField,
  Label,
  Avatar,
  Modal,
  ModalTitle,
  ModalContent,
  ModalContentText,
  ModalActions,
  CircularProgress,
  DataTable,
  type DataTableColumn,
  Dropdown,
  AlertDialog,
} from "@/components/ui";
import { DashboardHeader } from "@/components/admin/dashboard-header";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/query-client/categories";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { createCategoryInputSchema, type CreateCategoryInput } from "@/server/schemas/categories.schema";

type CategoryFormValues = CreateCategoryInput;

export default function CategoriesPage() {
  const toast = useToast();
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategoryInputSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      icon: values.icon ? stripAssetDomain(values.icon) : null,
    };

    if (editingId) {
      updateCategory(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            setIsOpen(false);
            setEditingId(null);
            setIsSlugManuallyEdited(false);
            form.reset();
          },
        },
      );
    } else {
      createCategory(payload, {
        onSuccess: () => {
          setIsOpen(false);
          setIsSlugManuallyEdited(false);
          form.reset();
        },
      });
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setIsSlugManuallyEdited(false);
    form.reset({
      name: "",
      slug: "",
      icon: "",
    });
    setIsOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setIsSlugManuallyEdited(true);
    form.reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "",
    });
    setIsOpen(true);
  };

  const selectedCategoryToDelete = categories?.find((c) => c.id === categoryToDelete);
  const hasProducts = Number(selectedCategoryToDelete?._count?.products ?? 0) > 0;

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete, {
        onSuccess: () => {
          setCategoryToDelete(null);
        },
      });
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
      setIsSlugManuallyEdited(false);
      form.reset({ name: "", slug: "", icon: "" });
    }
  };

  const watchedIcon = form.watch("icon");
  const isSubmitting = isCreating || isUpdating || uploading;

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "image",
        header: "Image",
        width: 80,
        cell: (cat) =>
          cat.icon ? (
            <Avatar
              src={getAssetUrl(cat.icon)}
              alt={cat.name}
              variant="rounded"
              sx={{ width: 36, height: 36, borderRadius: "6px" }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{ width: 36, height: 36, borderRadius: "6px", bgcolor: "action.hover" }}
            >
              {" "}
            </Avatar>
          ),
      },
      {
        id: "name",
        header: "Name",
        cell: (cat) => (
          <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
            {cat.name}
          </Typography>
        ),
      },
      {
        id: "slug",
        header: "Slug",
        cell: (cat) => (
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
            {cat.slug}
          </Typography>
        ),
      },
      {
        id: "products",
        header: "Products",
        cell: (cat) => (
          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
            {cat._count?.products || 0}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (cat) => (
          <Dropdown
            title="Actions"
            items={[
              {
                label: "Edit",
                icon: <EditOutlinedIcon sx={{ fontSize: 18 }} />,
                action: () => handleEdit(cat),
              },
              "divider",
              {
                label: "Delete",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => handleDelete(cat.id),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title="Categories"
        action={
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          >
            Add Category
          </Button>
        }
      />

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={categories ?? []}
        keyExtractor={(cat) => cat.id}
        isLoading={isLoading}
        emptyMessage="No categories found."
      />

      {/* Create / Edit Modal */}
      <Modal
        open={isOpen}
        onClose={(_, reason) => {
          if (!isSubmitting && (reason === "backdropClick" || reason === "escapeKeyDown")) {
            handleOpenChange(false);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
          <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>
            {editingId ? "Edit Category" : "Create Category"}
          </ModalTitle>
          <ModalContent dividers>
            <ModalContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              Manage your product categories here.
            </ModalContentText>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Name */}
              <Box>
                <Label htmlFor="category-name" sx={{ mb: 1, display: "block" }}>
                  Name
                </Label>
                <TextField
                  id="category-name"
                  fullWidth
                  size="small"
                  {...form.register("name", {
                    onChange: (e) => {
                      if (!editingId && !isSlugManuallyEdited) {
                        form.setValue("slug", slugify(e.target.value), { shouldValidate: true });
                      }
                    },
                  })}
                  error={!!form.formState.errors.name}
                  helperText={form.formState.errors.name?.message}
                />
              </Box>

              {/* Slug */}
              <Box>
                <Label htmlFor="category-slug" sx={{ mb: 1, display: "block" }}>
                  Slug
                </Label>
                <TextField
                  id="category-slug"
                  fullWidth
                  size="small"
                  {...form.register("slug", {
                    onChange: () => {
                      setIsSlugManuallyEdited(true);
                    },
                  })}
                  error={!!form.formState.errors.slug}
                  helperText={form.formState.errors.slug?.message}
                />
              </Box>

              {/* Image */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Label sx={{ display: "block" }}>
                  Image
                </Label>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {watchedIcon && (
                    <Box
                      component="img"
                      src={getAssetUrl(watchedIcon)}
                      alt="Preview"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "6px",
                        objectFit: "cover",
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Box sx={{ position: "relative" }}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      startIcon={
                        uploading ? (
                          <CircularProgress size={14} sx={{ color: "inherit" }} />
                        ) : (
                          <UploadFileOutlinedIcon sx={{ fontSize: 16 }} />
                        )
                      }
                    >
                      Upload
                    </Button>
                    <Box
                      component="input"
                      type="file"
                      accept="image/*"
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
          </ModalContent>

          <ModalActions sx={{ p: 2, gap: 1 }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </ModalActions>
        </Box>
      </Modal>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onClose={() => !isDeleting && setCategoryToDelete(null)}
        onConfirm={hasProducts ? () => setCategoryToDelete(null) : confirmDelete}
        title={hasProducts ? "Cannot Delete Category" : "Are you absolutely sure?"}
        description={
          hasProducts
            ? `This category "${selectedCategoryToDelete?.name}" currently has ${selectedCategoryToDelete?._count?.products} associated product(s). To delete this category, please delete or reassign its products first.`
            : `This action cannot be undone. This will permanently delete the category "${selectedCategoryToDelete?.name}".`
        }
        confirmText={hasProducts ? "Understood" : "Delete"}
        confirmVariant={hasProducts ? "primary" : "destructive"}
        cancelText={hasProducts ? undefined : "Cancel"}
      />
    </Box>
  );
}
