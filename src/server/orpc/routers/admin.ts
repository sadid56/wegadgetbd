import { adminContract } from "@/server/contracts/admin.contract";
import { implementAdmin } from "../init";
import {
  user,
  product,
  sale,
  payment,
  auditLog,
  session,
  customerReview,
  type AuditAction,
  type Role,
  type ReviewStatus,
} from "@/db/schema";
import { eq, and, or, ilike, desc, asc, count, gte, sql } from "drizzle-orm";

export const adminRouter = {
  dashboard: {
    stats: implementAdmin(adminContract.dashboard.stats).handler(async ({ context }) => {
      const now = new Date();
      const last30Days = new Date(new Date().setDate(now.getDate() - 30));

      const [
        [{ totalUsers }],
        [{ totalProducts }],
        [{ activeProducts }],
        [{ pendingProducts }],
        productsByStatus,
        sales,
        recentUsers,
        recentPayments,
      ] = await Promise.all([
        context.db.select({ totalUsers: count() }).from(user),
        context.db.select({ totalProducts: count() }).from(product),
        context.db
          .select({ activeProducts: count() })
          .from(product)
          .where(eq(product.status, "ACTIVE")),
        context.db
          .select({ pendingProducts: count() })
          .from(product)
          .where(eq(product.status, "PENDING")),
        context.db
          .select({ status: product.status, count: count() })
          .from(product)
          .groupBy(product.status),
        context.db
          .select({ date: sale.date, sellPrice: sale.sellPrice })
          .from(sale)
          .where(gte(sale.date, last30Days))
          .orderBy(asc(sale.date)),
        context.db.query.user.findMany({
          limit: 5,
          orderBy: [desc(user.createdAt)],
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        }),
        context.db.query.payment.findMany({
          limit: 5,
          orderBy: [desc(payment.date)],
          columns: {
            id: true,
            amount: true,
            method: true,
            status: true,
            date: true,
            transactionId: true,
            note: true,
          },
        }),
      ]);

      const salesMap = new Map<string, number>();
      const start = new Date(last30Days);
      const end = new Date(now);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        salesMap.set(dateStr, 0);
      }

      sales.forEach((s) => {
        const dateStr = new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const currentAmount = salesMap.get(dateStr) || 0;
        salesMap.set(dateStr, currentAmount + Number(s.sellPrice));
      });

      const salesChartData = Array.from(salesMap.entries()).map(([date, amount]) => ({
        date,
        amount,
      }));

      return {
        totalUsers: Number(totalUsers),
        totalProducts: Number(totalProducts),
        activeProducts: Number(activeProducts),
        pendingProducts: Number(pendingProducts),
        productsByStatus: productsByStatus.map((p) => ({
          status: p.status,
          _count: { _all: Number(p.count) },
        })),
        salesChartData,
        recentUsers,
        recentPayments: recentPayments.map((p) => ({ ...p, amount: Number(p.amount) })),
        recentActivity: [],
      };
    }),
  },

  auditLogs: {
    list: implementAdmin(adminContract.auditLogs.list).handler(async ({ input, context }) => {
      const page = input.page;
      const limit = input.limit;
      const search = input.search || "";
      const action = input.action as AuditAction | undefined;

      const offset = (page - 1) * limit;
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            ilike(auditLog.actorId, `%${search}%`),
            ilike(user.name, `%${search}%`),
            ilike(user.email, `%${search}%`)
          )!
        );
      }

      if (action) {
        conditions.push(eq(auditLog.action, action));
      }

      const whereClause = conditions.length ? and(...conditions) : undefined;

      const [logs, [{ total }]] = await Promise.all([
        context.db.query.auditLog.findMany({
          where: whereClause,
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: [desc(auditLog.timestamp)],
          limit,
          offset,
        }),
        context.db
          .select({ total: count() })
          .from(auditLog)
          .leftJoin(user, eq(auditLog.actorId, user.id))
          .where(whereClause),
      ]);

      return {
        logs,
        total: Number(total),
        currentPage: page,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      };
    }),
  },

  users: {
    list: implementAdmin(adminContract.users.list).handler(async ({ input, context }) => {
      const page = input.page;
      const limit = input.limit;
      const search = input.search;

      const conditions = [];
      if (search) {
        conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))!);
      }
      const whereClause = conditions.length ? and(...conditions) : undefined;
      const offset = (page - 1) * limit;

      const [usersList, [{ total }]] = await Promise.all([
        context.db.query.user.findMany({
          where: whereClause,
          orderBy: [desc(user.createdAt)],
          limit,
          offset,
          with: {
            sessions: {
              columns: { id: true },
            },
          },
        }),
        context.db.select({ total: count() }).from(user).where(whereClause),
      ]);

      const formatted = usersList.map((u) => ({
        ...u,
        _count: { sessions: u.sessions.length },
      }));

      return {
        users: formatted as any,
        total: Number(total),
        page,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      };
    }),

    get: implementAdmin(adminContract.users.get).handler(async ({ input, context }) => {
      const foundUser = await context.db.query.user.findFirst({
        where: eq(user.id, input.id),
        with: {
          sessions: true,
          auditLogs: {
            orderBy: [desc(auditLog.timestamp)],
            limit: 10,
          },
        },
      });

      if (!foundUser) {
        throw new Error("User not found");
      }

      return foundUser as any;
    }),

    update: implementAdmin(adminContract.users.update).handler(async ({ input, context }) => {
      const { id, banned, role: userRole, banReason } = input;
      const [updatedUser] = await context.db
        .update(user)
        .set({
          ...(banned !== undefined && { banned }),
          ...(userRole && { role: userRole as Role }),
          ...(banReason !== undefined && { banReason }),
        })
        .where(eq(user.id, id))
        .returning();

      await context.db
        .insert(auditLog)
        .values({
          action: (banned !== undefined
            ? banned
              ? "BLOCK_USER"
              : "UNBLOCK_USER"
            : "STATUS_CHANGE") as AuditAction,
          actorId: context.user.id,
          metadata: { userId: updatedUser.id, userEmail: updatedUser.email, banned, role: userRole },
        })
        .catch(() => null);

      return updatedUser as any;
    }),
  },

  sessions: {
    list: implementAdmin(adminContract.sessions.list).handler(async ({ input, context }) => {
      const page = input.page;
      const limit = input.limit;
      const userId = input.userId;

      const whereClause = userId ? eq(session.userId, userId) : undefined;
      const offset = (page - 1) * limit;

      const [sessionsList, [{ total }]] = await Promise.all([
        context.db.query.session.findMany({
          where: whereClause,
          orderBy: [desc(session.createdAt)],
          limit,
          offset,
          with: {
            user: {
              columns: { name: true, email: true },
            },
          },
        }),
        context.db.select({ total: count() }).from(session).where(whereClause),
      ]);

      return {
        sessions: sessionsList,
        total: Number(total),
        page,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      };
    }),

    revoke: implementAdmin(adminContract.sessions.revoke).handler(async ({ input, context }) => {
      const [deletedSession] = await context.db
        .delete(session)
        .where(eq(session.id, input.id))
        .returning();

      if (deletedSession) {
        await context.db
          .insert(auditLog)
          .values({
            action: "SESSION_REVOKE" as AuditAction,
            actorId: context.user.id,
            metadata: { sessionId: input.id, userId: deletedSession.userId },
          })
          .catch(() => null);
      }

      return {
        success: true,
        id: input.id,
      };
    }),
  },

  reviews: {
    list: implementAdmin(adminContract.reviews.list).handler(async ({ context }) => {
      const reviews = await context.db.query.customerReview.findMany({
        with: {
          product: {
            columns: { id: true, title: true, slug: true },
          },
        },
        orderBy: [desc(customerReview.createdAt)],
      });

      return reviews;
    }),

    create: implementAdmin(adminContract.reviews.create).handler(async ({ input, context }) => {
      const [newReview] = await context.db
        .insert(customerReview)
        .values({
          customerName: input.customerName,
          customerPic: input.customerPic ?? null,
          review: input.review,
          rating: input.rating,
          status: (input.status as ReviewStatus) || "PENDING",
          productId: input.productId ?? null,
        })
        .returning();

      const fullReview = await context.db.query.customerReview.findFirst({
        where: eq(customerReview.id, newReview.id),
        with: {
          product: {
            columns: { id: true, title: true, slug: true },
          },
        },
      });

      return fullReview as any;
    }),

    update: implementAdmin(adminContract.reviews.update).handler(async ({ input, context }) => {
      const { id, ...data } = input;
      await context.db
        .update(customerReview)
        .set({
          ...(data.customerName && { customerName: data.customerName }),
          ...(data.customerPic !== undefined && { customerPic: data.customerPic }),
          ...(data.review && { review: data.review }),
          ...(data.rating && { rating: data.rating }),
          ...(data.status && { status: data.status as ReviewStatus }),
          ...(data.productId !== undefined && { productId: data.productId }),
        })
        .where(eq(customerReview.id, id));

      const updated = await context.db.query.customerReview.findFirst({
        where: eq(customerReview.id, id),
        with: {
          product: {
            columns: { id: true, title: true, slug: true },
          },
        },
      });

      return updated as any;
    }),

    delete: implementAdmin(adminContract.reviews.delete).handler(async ({ input, context }) => {
      await context.db.delete(customerReview).where(eq(customerReview.id, input.id));
      return { success: true };
    }),
  },
};
