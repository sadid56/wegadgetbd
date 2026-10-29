import { z } from "zod";
import { adminProcedure } from "@/server/init";
import {
  dashboardStatsOutputSchema,
  listAuditLogsInputSchema,
  listAuditLogsOutputSchema,
  listUsersInputSchema,
  listUsersOutputSchema,
  userSchema,
  updateUserAdminInputSchema,
  listSessionsInputSchema,
  listSessionsOutputSchema,
  adminReviewSchema,
  createAdminReviewInputSchema,
  updateAdminReviewInputSchema,
} from "@/server/schemas/admin.schema";

import { GetDashboardStatsUseCase } from "@/server/use-case/admin/dashboard/get-stats";
import { ListAuditLogsUseCase } from "@/server/use-case/admin/audit-list/list-audit-logs";
import { ListUsersUseCase } from "@/server/use-case/admin/users/list-users";
import { GetUserUseCase } from "@/server/use-case/admin/users/get-user";
import { UpdateUserUseCase } from "@/server/use-case/admin/users/update-user";
import { ListSessionsUseCase } from "@/server/use-case/admin/sessions/list-sessions";
import { RevokeSessionUseCase } from "@/server/use-case/admin/sessions/revoke-session";
import { ListReviewsUseCase } from "@/server/use-case/admin/reviews/list-reviews";
import { CreateReviewUseCase } from "@/server/use-case/admin/reviews/create-reviews";
import { UpdateReviewUseCase } from "@/server/use-case/admin/reviews/update-review";
import { DeleteReviewUseCase } from "@/server/use-case/admin/reviews/delete-review";

export const adminRouter = {
  dashboard: {
    stats: adminProcedure
      .route({
        method: "GET",
        path: "/admin/dashboard",
        summary: "Get admin dashboard statistics",
        tags: ["Admin Dashboard"],
      })
      .input(z.object({}).optional())
      .output(dashboardStatsOutputSchema)
      .handler(async ({ context }) => new GetDashboardStatsUseCase(context.db).execute()),
  },

  auditLogs: {
    list: adminProcedure
      .route({
        method: "GET",
        path: "/admin/audit-logs",
        summary: "Get audit logs",
        tags: ["Admin Audit Logs"],
      })
      .input(listAuditLogsInputSchema)
      .output(listAuditLogsOutputSchema)
      .handler(async ({ input, context }) => new ListAuditLogsUseCase(context.db).execute(input)),
  },

  users: {
    list: adminProcedure
      .route({
        method: "GET",
        path: "/admin/users",
        summary: "List users",
        tags: ["Admin Users"],
      })
      .input(listUsersInputSchema)
      .output(listUsersOutputSchema)
      .handler(async ({ input, context }) => new ListUsersUseCase(context.db).execute(input)),

    get: adminProcedure
      .route({
        method: "GET",
        path: "/admin/users/:id",
        summary: "Get user details by id",
        tags: ["Admin Users"],
      })
      .input(z.object({ id: z.string() }))
      .output(userSchema)
      .handler(async ({ input, context }) => new GetUserUseCase(context.db).execute(input.id)),

    update: adminProcedure
      .route({
        method: "PATCH",
        path: "/admin/users/:id",
        summary: "Update user role or ban status",
        tags: ["Admin Users"],
      })
      .input(updateUserAdminInputSchema)
      .output(userSchema)
      .handler(async ({ input, context }) =>
        new UpdateUserUseCase(context.db, context.user.id).execute(input),
      ),
  },

  sessions: {
    list: adminProcedure
      .route({
        method: "GET",
        path: "/admin/sessions",
        summary: "List active sessions",
        tags: ["Admin Sessions"],
      })
      .input(listSessionsInputSchema)
      .output(listSessionsOutputSchema)
      .handler(async ({ input, context }) => new ListSessionsUseCase(context.db).execute(input)),

    revoke: adminProcedure
      .route({
        method: "DELETE",
        path: "/admin/sessions/:id",
        summary: "Revoke a session",
        tags: ["Admin Sessions"],
      })
      .input(z.object({ id: z.string() }))
      .output(z.object({ success: z.boolean(), id: z.string() }))
      .handler(async ({ input, context }) =>
        new RevokeSessionUseCase(context.db, context.user.id).execute(input.id),
      ),
  },

  reviews: {
    list: adminProcedure
      .route({
        method: "GET",
        path: "/admin/reviews",
        summary: "List all customer reviews",
        tags: ["Admin Reviews"],
      })
      .input(z.object({}).optional())
      .output(z.array(adminReviewSchema))
      .handler(async ({ context }) => new ListReviewsUseCase(context.db).execute()),

    create: adminProcedure
      .route({
        method: "POST",
        path: "/admin/reviews",
        summary: "Create customer review",
        tags: ["Admin Reviews"],
      })
      .input(createAdminReviewInputSchema)
      .output(adminReviewSchema)
      .handler(async ({ input, context }) => new CreateReviewUseCase(context.db).execute(input)),

    update: adminProcedure
      .route({
        method: "PATCH",
        path: "/admin/reviews/:id",
        summary: "Update customer review",
        tags: ["Admin Reviews"],
      })
      .input(updateAdminReviewInputSchema)
      .output(adminReviewSchema)
      .handler(async ({ input, context }) => new UpdateReviewUseCase(context.db).execute(input)),

    delete: adminProcedure
      .route({
        method: "DELETE",
        path: "/admin/reviews/:id",
        summary: "Delete customer review",
        tags: ["Admin Reviews"],
      })
      .input(z.object({ id: z.string() }))
      .output(z.object({ success: z.boolean() }))
      .handler(async ({ input, context }) => new DeleteReviewUseCase(context.db).execute(input.id)),
  },
};
