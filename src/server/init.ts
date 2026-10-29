import { os, ORPCError, implement } from "@orpc/server";
import { type ContractProcedure, type AnySchema, type ErrorMap, type Meta } from "@orpc/contract";
import { type Context } from "./context";

export const base = os.$context<Context>();

export const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.user || !context.session) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "You must be authenticated to access this resource",
    });
  }
  return next({
    context: {
      ...context,
      user: context.user,
      session: context.session,
    },
  });
});

export const adminMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "You must be authenticated to access this resource",
    });
  }
  if (context.user.role !== "ADMIN") {
    throw new ORPCError("FORBIDDEN", {
      message: "You do not have administrative permissions",
    });
  }
  return next();
});

export const publicProcedure = base;
export const protectedProcedure = base.use(authMiddleware);
export const adminProcedure = protectedProcedure.use(adminMiddleware);

type ContractProc<TInput extends AnySchema, TOutput extends AnySchema, TError extends ErrorMap, TMeta extends Meta> = ContractProcedure<
  TInput,
  TOutput,
  TError,
  TMeta
>;

function makeImpl<TInput extends AnySchema, TOutput extends AnySchema, TError extends ErrorMap, TMeta extends Meta>(
  contract: ContractProc<TInput, TOutput, TError, TMeta>,
) {
  return implement(contract).$context<Context>();
}

export const implementPublic = makeImpl;

export function implementProtected<TInput extends AnySchema, TOutput extends AnySchema, TError extends ErrorMap, TMeta extends Meta>(
  contract: ContractProc<TInput, TOutput, TError, TMeta>,
) {
  return makeImpl(contract).use(authMiddleware);
}

export function implementAdmin<TInput extends AnySchema, TOutput extends AnySchema, TError extends ErrorMap, TMeta extends Meta>(
  contract: ContractProc<TInput, TOutput, TError, TMeta>,
) {
  return makeImpl(contract).use(authMiddleware).use(adminMiddleware);
}
