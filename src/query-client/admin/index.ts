import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";

// SESSIONS
export const SessionEndpoints = {
  getSessions: (params?: any) => orpcClient.admin.sessions.list(params ?? {}),
  revokeSession: (id: string) => orpcClient.admin.sessions.revoke({ id }),
};

export const useSessions = (params?: any) => {
  return useQuery(orpc.admin.sessions.list.queryOptions({ input: params ?? {} }));
};

export const useRevokeSession = () =>
  useAppMutation({
    mutationFn: SessionEndpoints.revokeSession,
    invalidateKeys: [["sessions"], ["users"], ["user"]],
    successMessage: "Session revoked successfully",
  });

// AUDIT LOGS
export const AuditLogEndpoints = {
  getLogs: (params?: any) => orpcClient.admin.auditLogs.list(params ?? {}),
};

export const useAuditLogs = (params?: any) => {
  return useQuery(orpc.admin.auditLogs.list.queryOptions({ input: params ?? {} }));
};

// TRASH
export const TrashEndpoints = {
  getTrash: (params?: any) => orpcClient.admin.trash.list(params ?? {}),
  restore: (input: { id: string; itemType: "PRODUCT" | "CATEGORY" | "REVIEW" | "ORDER" }) =>
    orpcClient.admin.trash.restore(input),
  permanentDelete: (input: { id: string; itemType: "PRODUCT" | "CATEGORY" | "REVIEW" | "ORDER" }) =>
    orpcClient.admin.trash.permanentDelete(input),
};

export const useTrash = (params?: any) => {
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


