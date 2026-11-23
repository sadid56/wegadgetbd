import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";

type ListSessionsParams = Parameters<typeof orpcClient.admin.sessions.list>[0];
type ListTrashParams = Parameters<typeof orpcClient.admin.trash.list>[0];

// SESSIONS
export const SessionEndpoints = {
  getSessions: (params?: ListSessionsParams) => orpcClient.admin.sessions.list(params ?? {}),
  revokeSession: (id: string) => orpcClient.admin.sessions.revoke({ id }),
};

export const useSessions = (params?: ListSessionsParams) => {
  return useQuery(orpc.admin.sessions.list.queryOptions({ input: params ?? {} }));
};

export const useRevokeSession = () =>
  useAppMutation({
    mutationFn: SessionEndpoints.revokeSession,
    invalidateKeys: [orpc.admin.sessions.key(), orpc.admin.users.key()],
    successMessage: "Session revoked successfully",
  });

// TRASH
export const TrashEndpoints = {
  getTrash: (params?: ListTrashParams) => orpcClient.admin.trash.list(params ?? {}),
  restore: (input: { id: string; itemType: "PRODUCT" | "CATEGORY" | "REVIEW" | "ORDER" }) =>
    orpcClient.admin.trash.restore(input),
  permanentDelete: (input: { id: string; itemType: "PRODUCT" | "CATEGORY" | "REVIEW" | "ORDER" }) =>
    orpcClient.admin.trash.permanentDelete(input),
};

export const useTrash = (params?: ListTrashParams) => {
  return useQuery(orpc.admin.trash.list.queryOptions({ input: params ?? {} }));
};

export const useRestoreTrash = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: TrashEndpoints.restore,
    invalidateKeys: [["admin", "trash"], ["products"], ["categories"], ["reviews"], ["orders"]],
    successMessage: "Item restored successfully",
    ...options,
  });

export const usePermanentDeleteTrash = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: TrashEndpoints.permanentDelete,
    invalidateKeys: [["admin", "trash"]],
    successMessage: "Item permanently deleted with associated files",
    ...options,
  });


