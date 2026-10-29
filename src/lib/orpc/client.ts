import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@/server/routes";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
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

export const orpcClient: RouterClient<AppRouter> = createORPCClient(rpcLink);

export const orpc = createTanstackQueryUtils(orpcClient);
