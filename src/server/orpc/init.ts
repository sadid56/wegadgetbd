import { os, ORPCError, implement } from "@orpc/server";
import {
  type ContractProcedure,
  type AnySchema,
  type ErrorMap,
  type Meta,
} from "@orpc/contract";
import { type Context } from "./context";

// 1. Base builder with typed context
export const base = os.$context<Context>();

// 2. Auth Middleware: validates session and user presence
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

// 3. Admin Middleware: verifies ADMIN role
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

// 4. Standalone procedure builders
export const publicProcedure = base;
export const protectedProcedure = base.use(authMiddleware);
export const adminProcedure = base.use(authMiddleware).use(adminMiddleware);

// 5. Fully typed contract implementation helpers
export const implementPublic = <
  TInputSchema extends AnySchema,
  TOutputSchema extends AnySchema,
  TErrorMap extends ErrorMap,
  TMeta extends Meta
>(
  contract: ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta>
) => implement(contract).$context<Context>();

export const implementProtected = <
  TInputSchema extends AnySchema,
  TOutputSchema extends AnySchema,
  TErrorMap extends ErrorMap,
  TMeta extends Meta
>(
  contract: ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta>
) => implement(contract).$context<Context>().use(authMiddleware);

export const implementAdmin = <
  TInputSchema extends AnySchema,
  TOutputSchema extends AnySchema,
  TErrorMap extends ErrorMap,
  TMeta extends Meta
>(
  contract: ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta>
) => implement(contract).$context<Context>().use(authMiddleware).use(adminMiddleware);
