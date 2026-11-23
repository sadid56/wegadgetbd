"use client";

import { useCallback, useMemo, useState } from "react";
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
  FileDropdown,
} from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DashboardHeader } from "@/components/admin/dashboard-header";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/query-client/categories";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { createCategoryInputSchema, type CreateCategoryInput } from "@/server/schemas/categories.schema";

type CategoryFormValues = CreateCategoryInput;
type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  productCount?: number;
  _count?: { products: number };
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

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

  const handleEdit = useCallback(
    (category: CategoryItem) => {
      setEditingId(category.id);
      setIsSlugManuallyEdited(true);
      form.reset({
        name: category.name,
        slug: category.slug,
        icon: category.icon || "",
      });
      setIsOpen(true);
    },
    [form],
  );

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

  const handleImageUpload = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const file = files[0];
      const { url } = await uploadFileToStorage({ file, folder: "categories" });
      form.setValue("icon", url);
    } catch (error: unknown) {
      toast.error("Upload failed: " + ((error as { message?: string })?.message || "Unknown error"));
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

  const columns: DataTableColumn<CategoryItem>[] = useMemo(
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
    [handleEdit],
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
        maxWidth='sm'
        fullWidth
      >
        <Form {...form}>
          <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column" }}>
            <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>
              {editingId ? "Edit Category" : "Create Category"}
            </ModalTitle>
            <ModalContent dividers>
              <ModalContentText sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
                Manage your product categories here.
              </ModalContentText>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          size='small'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!editingId && !isSlugManuallyEdited) {
                              form.setValue("slug", slugify(e.target.value), { shouldValidate: true });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          size='small'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setIsSlugManuallyEdited(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Label sx={{ display: "block" }}>
                    Image
                  </Label>
                  <FileDropdown
                    value={watchedIcon}
                    onFilesSelect={handleImageUpload}
                    onRemove={() => form.setValue("icon", "")}
                    uploading={uploading}
                    title='Drop category image here or click to upload'
                    subtitle='PNG, JPG, WEBP recommended (1:1 ratio)'
                  />
                </Box>
              </Box>
            </ModalContent>

            <ModalActions sx={{ p: 2, gap: 1 }}>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='primary'
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : undefined}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </ModalActions>
          </Box>
        </Form>
      </Modal>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onClose={() => !isDeleting && setCategoryToDelete(null)}
        onConfirm={hasProducts ? () => setCategoryToDelete(null) : confirmDelete}
        title={hasProducts ? "Cannot Delete Category" : "Move Category to Trash?"}
        description={
          hasProducts
            ? `This category "${selectedCategoryToDelete?.name}" currently has ${selectedCategoryToDelete?._count?.products} active associated product(s). To delete this category, please delete or reassign its products first.`
            : `This will move "${selectedCategoryToDelete?.name}" to Trash. You can restore it anytime or delete it permanently from the Trash.`
        }
        confirmText={hasProducts ? "Understood" : "Move to Trash"}
        confirmVariant={hasProducts ? "primary" : "destructive"}
        cancelText={hasProducts ? undefined : "Cancel"}
      />
    </Box>
  );
}
