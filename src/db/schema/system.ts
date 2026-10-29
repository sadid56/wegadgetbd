import {
  pgTable,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { user } from "./auth";

// ==========================================
// ENUMS
// ==========================================
export const auditActionEnum = pgEnum("AuditAction", [
  "CREATE_PRODUCT",
  "UPDATE_PRODUCT",
  "DELETE_PRODUCT",
  "STATUS_CHANGE",
  "LOGIN",
  "SESSION_REVOKE",
  "BLOCK_USER",
  "UNBLOCK_USER",
  "UPDATE_SETTINGS",
]);
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

// ==========================================
// TABLES
// ==========================================
export const auditLog = pgTable("AuditLog", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  action: auditActionEnum("action").notNull(),
  actorId: text("actorId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  actorType: text("actorType").default("ADMIN").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),
});

export const siteSettings = pgTable("SiteSettings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  whatsappNumber: text("whatsappNumber").notNull(),
  currency: text("currency").default("BDT").notNull(),
  seoDefaults: jsonb("seoDefaults"),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const homepageContent = pgTable("HomepageContent", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  heroTitle: text("heroTitle").notNull(),
  heroSubtitle: text("heroSubtitle"),
  heroImage: text("heroImage"),
  featuredCategoryIds: text("featuredCategoryIds")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  featuredProductIds: text("featuredProductIds")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

// ==========================================
// RELATIONS
// ==========================================
export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, {
    fields: [auditLog.actorId],
    references: [user.id],
  }),
}));

// ==========================================
// TYPES
// ==========================================
export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;

export type HomepageContent = typeof homepageContent.$inferSelect;
export type InsertHomepageContent = typeof homepageContent.$inferInsert;

