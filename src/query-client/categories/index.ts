import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation, type MutationOptions } from "@/hooks/useAppMutation";

const categoryListKeys = orpc.categories.list.queryOptions({ input: {} }).queryKey;
const adminCategoryListKeys = orpc.categories.adminList.queryOptions({ input: {} }).queryKey;
const categoryGeneralKeys = orpc.categories.key();
const productKeys = orpc.products.list.queryOptions({ input: {} }).queryKey;
const adminProductKeys = orpc.products.adminList.queryOptions({ input: {} }).queryKey;
const adminDashboardKeys = orpc.admin.dashboard.stats.queryOptions({ input: {} }).queryKey;

type CreateCategoryPayload = Parameters<typeof orpcClient.categories.create>[0];
type UpdateCategoryPayload = Parameters<typeof orpcClient.categories.update>[0];

export const CategoryEndpoints = {
  getCategories: () => orpcClient.categories.list(),
  getAdminCategories: () => orpcClient.categories.adminList(),
  createCategory: (data: CreateCategoryPayload) => orpcClient.categories.create(data),
  updateCategory: ({ id, data }: { id: string; data: UpdateCategoryPayload["data"] }) =>
    orpcClient.categories.update({ id, data }),
  deleteCategory: (id: string) => orpcClient.categories.delete({ id }),
};

export const useCategories = () => {
  return useQuery(orpc.categories.list.queryOptions({ input: {} }));
};

export const useAdminCategories = () => {
  return useQuery(orpc.categories.adminList.queryOptions({ input: {} }));
};

export const useCreateCategory = (options?: Partial<MutationOptions<CreateCategoryPayload>>) =>
  useAppMutation({
    mutationFn: CategoryEndpoints.createCategory,
    invalidateKeys: [categoryListKeys, adminCategoryListKeys, categoryGeneralKeys, productKeys, adminProductKeys, adminDashboardKeys],
    successMessage: "Category created successfully",
    ...options,
  });

export const useUpdateCategory = (options?: Partial<MutationOptions<{ id: string; data: UpdateCategoryPayload["data"] }>>) =>
  useAppMutation({
    mutationFn: CategoryEndpoints.updateCategory,
    invalidateKeys: [categoryListKeys, adminCategoryListKeys, categoryGeneralKeys, productKeys, adminProductKeys, adminDashboardKeys],
    successMessage: "Category updated successfully",
    ...options,
  });

export const useDeleteCategory = (options?: Partial<MutationOptions<string>>) =>
  useAppMutation({
    mutationFn: CategoryEndpoints.deleteCategory,
    invalidateKeys: [categoryListKeys, adminCategoryListKeys, categoryGeneralKeys, productKeys, adminProductKeys, adminDashboardKeys],
    successMessage: "Category deleted successfully",
    ...options,
  });
