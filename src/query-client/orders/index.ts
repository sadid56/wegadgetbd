import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";

export interface OrdersFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const OrderEndpoints = {
  getOrders: (params: OrdersFilterParams = {}) => orpcClient.orders.list(params),
  getOrder: (id: string) => orpcClient.orders.get({ id }),
  createOrder: (data: any) => orpcClient.orders.create(data),
  updateOrderStatus: ({ id, status }: { id: string; status: any }) =>
    orpcClient.orders.updateStatus({ id, status }),
  updateOrder: ({ id, data }: { id: string; data: any }) =>
    orpcClient.orders.update({ id, data }),
  deleteOrder: (id: string) => orpcClient.orders.delete({ id }),
};

export const useOrders = (params: OrdersFilterParams = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrderEndpoints.getOrders(params),
  });
};

export const useCreateOrder = () =>
  useAppMutation({
    mutationFn: OrderEndpoints.createOrder,
    invalidateKeys: [["orders"]],
    successMessage: "Order placed successfully",
  });

export const useUpdateOrderStatus = () =>
  useAppMutation({
    mutationFn: OrderEndpoints.updateOrderStatus,
    invalidateKeys: [["orders"]],
    successMessage: "Order status updated",
  });

export const useUpdateOrder = () =>
  useAppMutation({
    mutationFn: OrderEndpoints.updateOrder,
    invalidateKeys: [["orders"]],
    successMessage: "Order updated successfully",
  });

export const useDeleteOrder = () =>
  useAppMutation({
    mutationFn: OrderEndpoints.deleteOrder,
    invalidateKeys: [["orders"]],
    successMessage: "Order deleted successfully",
  });

