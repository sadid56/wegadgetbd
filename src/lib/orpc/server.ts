import { createRouterClient } from "@orpc/server";
import { appRouter } from "@/server/orpc/routers";
import { createContext } from "@/server/orpc/context";

export const orpcServer = createRouterClient(appRouter, {
  context: async () => createContext(),
});
