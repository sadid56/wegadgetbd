import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@/server/orpc/routers";
import { createContext } from "@/server/orpc/context";

const handler = new RPCHandler(appRouter);

async function handle(request: Request) {
  const context = await createContext({ headers: request.headers });
  const { matched, response } = await handler.handle(request, {
    prefix: "/api/orpc",
    context,
  });

  if (matched && response) {
    return response;
  }

  return new Response("Not Found", { status: 404 });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
