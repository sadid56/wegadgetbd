import { oc } from "@orpc/contract";
import { z } from "zod";
import { paginationInputSchema } from "./common.contract";

// Dashboard Stats Schema
export const dashboardStatsOutputSchema = z.object({
  totalUsers: z.number(),
  totalProducts: z.number(),
  activeProducts: z.number(),
  pendingProducts: z.number(),
  productsByStatus: z.array(z.any()),
  salesChartData: z.array(
    z.object({
      date: z.string(),
      amount: z.number(),
    }),
  ),
  recentUsers: z.array(z.any()),
  recentPayments: z.array(z.any()),
  recentActivity: z.array(z.any()),
});

// Audit Logs Schemas
export const auditLogSchema = z.object({
  id: z.string(),
  action: z.string(),
  actorId: z.string(),
  metadata: z.any().nullable().optional(),
  timestamp: z.date().or(z.string()),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .nullable()
    .optional(),
});

export const listAuditLogsInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
  action: z.string().optional(),
});

export const listAuditLogsOutputSchema = z.object({
  logs: z.array(auditLogSchema),
  total: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
});

// Users Schemas
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  role: z.string(),
  banned: z.boolean(),
  banReason: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  _count: z.object({ sessions: z.number() }).optional(),
  sessions: z.array(z.any()).optional(),
  auditLogs: z.array(z.any()).optional(),
});

export const listUsersInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
});

export const listUsersOutputSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

export const updateUserAdminInputSchema = z.object({
  id: z.string(),
  banned: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  banReason: z.string().nullable().optional(),
});

// Sessions Schemas
export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date().or(z.string()),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  user: z
    .object({
      name: z.string(),
      email: z.string(),
    })
    .optional(),
});

export const listSessionsInputSchema = paginationInputSchema.extend({
  userId: z.string().optional(),
});

export const listSessionsOutputSchema = z.object({
  sessions: z.array(sessionSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

// Customer Reviews Admin Schemas
export const adminReviewSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerPic: z.string().nullable().optional(),
  review: z.string(),
  rating: z.number(),
  status: z.string(),
  productId: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  product: z
    .object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),
});

export const createAdminReviewInputSchema = z.object({
  customerName: z.string().min(1),
  customerPic: z.string().nullable().optional(),
  review: z.string().min(1),
  rating: z.number().min(1).max(5),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  productId: z.string().nullable().optional(),
});

export const updateAdminReviewInputSchema = z.object({
  id: z.string(),
  customerName: z.string().optional(),
  customerPic: z.string().nullable().optional(),
  review: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  productId: z.string().nullable().optional(),
});


// The Admin Contract
export const adminContract = {
  dashboard: {
    stats: oc
      .route({ method: "GET", path: "/admin/dashboard", summary: "Get admin dashboard statistics" })
      .input(z.object({}).optional())
      .output(dashboardStatsOutputSchema),
  },

  auditLogs: {
    list: oc
      .route({ method: "GET", path: "/admin/audit-logs", summary: "Get audit logs" })
      .input(listAuditLogsInputSchema)
      .output(listAuditLogsOutputSchema),
  },

  users: {
    list: oc
      .route({ method: "GET", path: "/admin/users", summary: "List users" })
      .input(listUsersInputSchema)
      .output(listUsersOutputSchema),

    get: oc
      .route({ method: "GET", path: "/admin/users/:id", summary: "Get user details by id" })
      .input(z.object({ id: z.string() }))
      .output(userSchema),

    update: oc
      .route({ method: "PATCH", path: "/admin/users/:id", summary: "Update user role or ban status" })
      .input(updateUserAdminInputSchema)
      .output(userSchema),
  },

  sessions: {
    list: oc
      .route({ method: "GET", path: "/admin/sessions", summary: "List active sessions" })
      .input(listSessionsInputSchema)
      .output(listSessionsOutputSchema),

    revoke: oc
      .route({ method: "DELETE", path: "/admin/sessions/:id", summary: "Revoke a session" })
      .input(z.object({ id: z.string() }))
      .output(z.object({ success: z.boolean(), id: z.string() })),
  },

  reviews: {
    list: oc
      .route({ method: "GET", path: "/admin/reviews", summary: "List all customer reviews" })
      .input(z.object({}).optional())
      .output(z.array(adminReviewSchema)),

    create: oc
      .route({ method: "POST", path: "/admin/reviews", summary: "Create customer review" })
      .input(createAdminReviewInputSchema)
      .output(adminReviewSchema),

    update: oc
      .route({ method: "PATCH", path: "/admin/reviews/:id", summary: "Update customer review" })
      .input(updateAdminReviewInputSchema)
      .output(adminReviewSchema),

    delete: oc
      .route({ method: "DELETE", path: "/admin/reviews/:id", summary: "Delete customer review" })
      .input(z.object({ id: z.string() }))
      .output(z.object({ success: z.boolean() })),
  },
};
