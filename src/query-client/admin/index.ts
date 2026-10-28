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

