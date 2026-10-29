import { createRouterClient } from "@orpc/server";
import { appRouter } from "@/server/routes";
import { createContext } from "@/server/context";

export const orpcServer = createRouterClient(appRouter, {
  context: async () => createContext(),
});
