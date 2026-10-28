import { useAppMutation } from "@/hooks/useAppMutation";
import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

export const UserEndpoints = {
  getUsers: (params?: any) => orpcClient.admin.users.list(params ?? {}),
  getUser: (id: string) => orpcClient.admin.users.get({ id }),
  updateUser: ({ id, data }: { id: string; data: any }) => orpcClient.admin.users.update({ id, ...data }),
};

export const useUsers = (params?: any) => {
  return useQuery(orpc.admin.users.list.queryOptions({ input: params ?? {} }));
};

export const useUser = (id: string) => {
  return useQuery({
    ...orpc.admin.users.get.queryOptions({ input: { id } }),
    enabled: !!id,
  });
};

export const useUpdateUser = () =>
  useAppMutation({
    mutationFn: UserEndpoints.updateUser,
    invalidateKeys: [["users"], ["user"]],
    successMessage: "User updated successfully",
  });
