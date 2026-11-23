import { orpcClient, orpc } from "@/lib/orpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppMutation, type MutationOptions } from "@/hooks/useAppMutation";

export type AdminPromoCodesResponse = Awaited<ReturnType<typeof orpcClient.promoCodes.adminList>>;
export type PromoCodeItem = AdminPromoCodesResponse["promoCodes"][number];
type ListParams = Parameters<typeof orpcClient.promoCodes.adminList>[0];

const promoCodeBaseKey = orpc.promoCodes.key();

export const PromoCodeEndpoints = {
  validate: (data: { code: string; subtotal: number }) => orpcClient.promoCodes.validate(data),
  adminList: (params?: ListParams) => orpcClient.promoCodes.adminList(params ?? {}),
  create: (data: Parameters<typeof orpcClient.promoCodes.create>[0]) => orpcClient.promoCodes.create(data),
  update: (data: Parameters<typeof orpcClient.promoCodes.update>[0]) => orpcClient.promoCodes.update(data),
  delete: (id: string) => orpcClient.promoCodes.delete({ id }),
};

export const useAdminPromoCodes = (params?: ListParams) =>
  useQuery(orpc.promoCodes.adminList.queryOptions({ input: params ?? {} }));

export const useValidatePromoCode = () =>
  useMutation({
    mutationFn: PromoCodeEndpoints.validate,
  });

type CreatePromoPayload = Parameters<typeof orpcClient.promoCodes.create>[0];
type UpdatePromoPayload = Parameters<typeof orpcClient.promoCodes.update>[0];

export const useCreatePromoCode = (options?: Partial<MutationOptions<CreatePromoPayload>>) =>
  useAppMutation({
    mutationFn: PromoCodeEndpoints.create,
    invalidateKeys: [promoCodeBaseKey],
    successMessage: "Promo code created successfully",
    ...options,
  });

export const useUpdatePromoCode = (options?: Partial<MutationOptions<UpdatePromoPayload>>) =>
  useAppMutation({
    mutationFn: PromoCodeEndpoints.update,
    invalidateKeys: [promoCodeBaseKey],
    successMessage: "Promo code updated successfully",
    ...options,
  });

export const useDeletePromoCode = (options?: Partial<MutationOptions<string>>) =>
  useAppMutation({
    mutationFn: PromoCodeEndpoints.delete,
    invalidateKeys: [promoCodeBaseKey],
    successMessage: "Promo code deleted successfully",
    ...options,
  });
