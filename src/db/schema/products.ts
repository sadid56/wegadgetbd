import {
  pgTable,
  text,
  boolean,
  timestamp,
  numeric,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { customerReview } from "./reviews";

// ==========================================
// ENUMS
// ==========================================
export const productStatusEnum = pgEnum("ProductStatus", ["PENDING", "ACTIVE", "INACTIVE"]);
export type ProductStatus = (typeof productStatusEnum.enumValues)[number];

export const productLabelEnum = pgEnum("ProductLabel", ["NONE", "NEW", "SPECIAL", "BEST_SELLER"]);
export type ProductLabel = (typeof productLabelEnum.enumValues)[number];

// ==========================================
// TABLES
// ==========================================
export const category = pgTable("Category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const product = pgTable(
  "Product",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    markdown_description: text("markdown_description"),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    discountPrice: numeric("discountPrice", { precision: 12, scale: 2 }),
    images: text("images")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    categoryId: text("categoryId")
      .notNull()
      .references(() => category.id),
    status: productStatusEnum("status").default("PENDING").notNull(),
    specifications: jsonb("specifications"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    featuredBanner: text("featuredBanner"),
    label: productLabelEnum("label").default("NONE").notNull(),
    inStock: boolean("inStock").default(true).notNull(),
    rating: doublePrecision("rating").default(5.0).notNull(),
    videoLinks: text("videoLinks")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    model: text("model"),
    brand: text("brand"),
    whyBuyText: text("whyBuyText"),
    soldCount: integer("soldCount").default(360).notNull(),
    messengerUrl: text("messengerUrl"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("product_status_idx").on(table.status),
    index("product_categoryId_idx").on(table.categoryId),
  ]
);

// ==========================================
// RELATIONS
// ==========================================
export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  reviews: many(customerReview),
}));

// ==========================================
// TYPES
// ==========================================
export type Category = typeof category.$inferSelect;
export type InsertCategory = typeof category.$inferInsert;

export type Product = typeof product.$inferSelect;
export type InsertProduct = typeof product.$inferInsert;

