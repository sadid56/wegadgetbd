import { orpcClient } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";

export interface SalesFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  sellerName?: string;
}

export const SaleEndpoints = {
  getSales: (params: SalesFilterParams = {}) => orpcClient.sales.list(params),
  getSale: (id: string) => orpcClient.sales.get({ id }),
  createSale: (data: any) => orpcClient.sales.create(data),
  updateSale: ({ id, data }: { id: string; data: any }) => orpcClient.sales.update({ id, data }),
  deleteSale: (id: string) => orpcClient.sales.delete({ id }),
};

export const useSales = (params: SalesFilterParams = {}) => {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => SaleEndpoints.getSales(params),
  });
};

export const useCreateSale = () =>
  useAppMutation({
    mutationFn: SaleEndpoints.createSale,
    invalidateKeys: [["sales"]],
    successMessage: "Sale record added successfully",
  });

export const useUpdateSale = () =>
  useAppMutation({
    mutationFn: SaleEndpoints.updateSale,
    invalidateKeys: [["sales"]],
    successMessage: "Sale record updated successfully",
  });

export const useDeleteSale = () =>
  useAppMutation({
    mutationFn: SaleEndpoints.deleteSale,
    invalidateKeys: [["sales"]],
    successMessage: "Sale record deleted successfully",
  });

