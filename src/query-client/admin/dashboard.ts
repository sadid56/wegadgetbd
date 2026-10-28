import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

export const DashboardEndpoints = {
  getStats: () => orpcClient.admin.dashboard.stats(),
};

export const useDashboardStats = () => {
  return useQuery({
    ...orpc.admin.dashboard.stats.queryOptions({ input: {} }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
