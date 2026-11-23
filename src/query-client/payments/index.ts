import { orpcClient } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";

export interface PaymentsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
}

type CreatePaymentPayload = Parameters<typeof orpcClient.payments.create>[0];
type UpdatePaymentPayload = Parameters<typeof orpcClient.payments.update>[0];

export const PaymentEndpoints = {
  getPayments: (params: PaymentsFilterParams = {}) => orpcClient.payments.list(params),
  createPayment: (data: CreatePaymentPayload) => orpcClient.payments.create(data),
  updatePayment: ({ id, data }: { id: string; data: UpdatePaymentPayload["data"] }) =>
    orpcClient.payments.update({ id, data }),
  deletePayment: (id: string) => orpcClient.payments.delete({ id }),
};

export const usePayments = (params: PaymentsFilterParams = {}) => {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => PaymentEndpoints.getPayments(params),
  });
};

export const useCreatePayment = () =>
  useAppMutation({
    mutationFn: PaymentEndpoints.createPayment,
    invalidateKeys: [["payments"]],
    successMessage: "Payment record added successfully",
  });

export const useUpdatePayment = () =>
  useAppMutation({
    mutationFn: PaymentEndpoints.updatePayment,
    invalidateKeys: [["payments"]],
    successMessage: "Payment record updated successfully",
  });

export const useDeletePayment = () =>
  useAppMutation({
    mutationFn: PaymentEndpoints.deletePayment,
    invalidateKeys: [["payments"]],
    successMessage: "Payment record deleted successfully",
  });

