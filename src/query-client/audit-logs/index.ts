import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

export interface AuditLogsParams {
  search?: string;
  page?: number;
  limit?: number;
  action?: string;
}

export const auditLogsEndpoint = {
  GET: (params: AuditLogsParams = {}) => orpcClient.admin.auditLogs.list(params),
};

export const useAuditLogs = (params: AuditLogsParams = {}) => {
  return useQuery(orpc.admin.auditLogs.list.queryOptions({ input: params }));
};
