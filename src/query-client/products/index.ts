import { useAppMutation } from "@/hooks/useAppMutation";
import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

export type ProductsResponse = Awaited<ReturnType<typeof orpcClient.products.list>>;
export type SingleProductResponse = Awaited<ReturnType<typeof orpcClient.products.bySlug>>;
export type Product = ProductsResponse["products"][number];

type ListParams = Parameters<typeof orpcClient.products.list>[0];
type AdminListParams = Parameters<typeof orpcClient.products.adminList>[0];
type CreatePayload = Parameters<typeof orpcClient.products.create>[0];
type UpdatePayload = Parameters<typeof orpcClient.products.update>[0];

const productKeys = orpc.products.list.queryOptions({ input: {} }).queryKey;
const adminProductKeys = orpc.products.adminList.queryOptions({ input: {} }).queryKey;
const singleProductKeys = orpc.products.bySlug.queryOptions({ input: { slug: "" } }).queryKey;

export const ProductEndpoints = {
  getProducts: (params?: ListParams) => orpcClient.products.list(params ?? {}),
  getProduct: (slug: string) => orpcClient.products.bySlug({ slug }),
  createProduct: (data: CreatePayload) => orpcClient.products.create(data),
  updateProduct: (data: UpdatePayload) => orpcClient.products.update(data),
  deleteProduct: (id: string) => orpcClient.products.delete({ id }),
};

export const useProducts = (params?: ListParams) => useQuery(orpc.products.list.queryOptions({ input: params ?? {} }));

export const useProduct = (slug: string) =>
  useQuery({
    ...orpc.products.bySlug.queryOptions({ input: { slug } }),
    enabled: !!slug,
  });

export const useAdminProducts = (params?: AdminListParams) => useQuery(orpc.products.adminList.queryOptions({ input: params ?? {} }));

export const useCreateProduct = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: ProductEndpoints.createProduct,
    invalidateKeys: [adminProductKeys, productKeys],
    successMessage: "Product created successfully",
    ...options,
  });

export const useUpdateProduct = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: ProductEndpoints.updateProduct,
    invalidateKeys: [adminProductKeys, productKeys, singleProductKeys],
    successMessage: "Product updated successfully",
    ...options,
  });

export const useDeleteProduct = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: ProductEndpoints.deleteProduct,
    invalidateKeys: [adminProductKeys, productKeys],
    successMessage: "Product deleted successfully",
    ...options,
  });

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: ["products", productId, "reviews"],
    queryFn: () => orpcClient.products.reviews({ productId }),
    enabled: !!productId,
  });