import { useAppMutation } from "@/hooks/useAppMutation";
import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

// Types
export type ProductsResponse = Awaited<ReturnType<typeof orpcClient.products.list>>;
export type SingleProductResponse = Awaited<ReturnType<typeof orpcClient.products.bySlug>>;
export type Product = ProductsResponse["products"][number];

// API Endpoints powered by oRPC
export const ProductEndpoints = {
  getProducts: (params?: any) => orpcClient.products.list(params ?? {}),
  getProductCallback: (slug: string) => orpcClient.products.bySlug({ slug }),

  // Admin
  createProduct: (data: any) => orpcClient.products.create(data),
  updateProduct: ({ id, data }: { id: string; data: any }) => orpcClient.products.update({ id, data }),
  deleteProduct: (id: string) => orpcClient.products.delete({ id }),
};

// Hooks
export const useProducts = (params?: any) => {
  return useQuery(orpc.products.list.queryOptions({ input: params ?? {} }));
};

export const useProduct = (slug: string) => {
  return useQuery({
    ...orpc.products.bySlug.queryOptions({ input: { slug } }),
    enabled: !!slug,
  });
};

export const useAdminProducts = (params?: any) => {
  return useQuery(orpc.products.adminList.queryOptions({ input: params }));
};

export const useCreateProduct = () =>
  useAppMutation({
    mutationFn: ProductEndpoints.createProduct,
    invalidateKeys: [["adminProducts"], ["products"]],
    successMessage: "Product created successfully",
  });

export const useUpdateProduct = () =>
  useAppMutation({
    mutationFn: ProductEndpoints.updateProduct,
    invalidateKeys: [["adminProducts"], ["products"], ["product"]],
    successMessage: "Product updated successfully",
  });

export const useDeleteProduct = () =>
  useAppMutation({
    mutationFn: ProductEndpoints.deleteProduct,
    invalidateKeys: [["adminProducts"], ["products"]],
    successMessage: "Product deleted successfully",
  });
