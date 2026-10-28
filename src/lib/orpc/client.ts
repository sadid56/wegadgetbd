import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { ContractRouterClient } from "@orpc/contract";
import type { appContract } from "@/server/contracts";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const rpcLink = new RPCLink({
  url: `${getBaseUrl()}/api/orpc`,
  fetch: (input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Ensure auth session cookies are sent
    });
  },
});

export const orpcClient: ContractRouterClient<typeof appContract> = createORPCClient(rpcLink);

export const orpc = createTanstackQueryUtils(orpcClient);
