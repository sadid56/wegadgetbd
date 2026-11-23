import { useAppMutation } from "@/hooks/useAppMutation";
import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

type ListUsersParams = Parameters<typeof orpcClient.admin.users.list>[0];
type UpdateUserPayload = Parameters<typeof orpcClient.admin.users.update>[0];

export const UserEndpoints = {
  getUsers: (params?: ListUsersParams) => orpcClient.admin.users.list(params ?? {}),
  getUser: (id: string) => orpcClient.admin.users.get({ id }),
  updateUser: ({ id, data }: { id: string; data: Omit<UpdateUserPayload, "id"> }) =>
    orpcClient.admin.users.update({ id, ...data }),
};

export const useUsers = (params?: ListUsersParams) => {
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
    invalidateKeys: [orpc.admin.users.key()],
    successMessage: "User updated successfully",
  });
