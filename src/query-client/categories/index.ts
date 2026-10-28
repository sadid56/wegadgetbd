import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";

export const CategoryEndpoints = {
  getCategories: () => orpcClient.categories.list(),
  createCategory: (data: any) => orpcClient.categories.create(data),
  updateCategory: ({ id, data }: { id: string; data: any }) => orpcClient.categories.update({ id, data }),
  deleteCategory: (id: string) => orpcClient.categories.delete({ id }),
};

export const useCategories = () => {
  return useQuery(orpc.categories.list.queryOptions({ input: {} }));
};

export const useCreateCategory = () =>
  useAppMutation({
    mutationFn: CategoryEndpoints.createCategory,
    invalidateKeys: [["categories"]],
    successMessage: "Category created successfully",
  });

export const useUpdateCategory = () =>
  useAppMutation({
    mutationFn: CategoryEndpoints.updateCategory,
    invalidateKeys: [["categories"]],
    successMessage: "Category updated successfully",
  });

export const useDeleteCategory = () =>
  useAppMutation({
    mutationFn: CategoryEndpoints.deleteCategory,
    invalidateKeys: [["categories"]],
    successMessage: "Category deleted successfully",
  });
