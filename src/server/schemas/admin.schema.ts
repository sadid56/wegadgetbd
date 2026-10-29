import { z } from "zod";
import { paginationInputSchema } from "./common.schema";

// Dashboard Stats Schema
export const dashboardStatsOutputSchema = z.object({
  totalUsers: z.number(),
  totalProducts: z.number(),
  activeProducts: z.number(),
  pendingProducts: z.number(),
  totalOrders: z.number().optional().default(0),
  totalRevenue: z.number().optional().default(0),
  totalProfit: z.number().optional().default(0),
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

export type DashboardStatsOutput = z.infer<typeof dashboardStatsOutputSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type ListAuditLogsInput = z.infer<typeof listAuditLogsInputSchema>;
export type ListAuditLogsOutput = z.infer<typeof listAuditLogsOutputSchema>;
export type User = z.infer<typeof userSchema>;
export type ListUsersInput = z.infer<typeof listUsersInputSchema>;
export type ListUsersOutput = z.infer<typeof listUsersOutputSchema>;
export type UpdateUserAdminInput = z.infer<typeof updateUserAdminInputSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type ListSessionsInput = z.infer<typeof listSessionsInputSchema>;
export type ListSessionsOutput = z.infer<typeof listSessionsOutputSchema>;
export type AdminReview = z.infer<typeof adminReviewSchema>;
export type CreateAdminReviewInput = z.infer<typeof createAdminReviewInputSchema>;
export type UpdateAdminReviewInput = z.infer<typeof updateAdminReviewInputSchema>;

