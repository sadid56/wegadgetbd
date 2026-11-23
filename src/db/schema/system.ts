import {
  pgTable,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ==========================================
// TABLES
// ==========================================
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
// TYPES
// ==========================================
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;

export type HomepageContent = typeof homepageContent.$inferSelect;
export type InsertHomepageContent = typeof homepageContent.$inferInsert;
