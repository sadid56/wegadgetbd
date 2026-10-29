import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { product } from "./products";

// ==========================================
// ENUMS
// ==========================================
export const reviewStatusEnum = pgEnum("ReviewStatus", ["PENDING", "APPROVED", "REJECTED"]);
export type ReviewStatus = (typeof reviewStatusEnum.enumValues)[number];

// ==========================================
// TABLES
// ==========================================
export const customerReview = pgTable("CustomerReview", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerName: text("customerName").notNull(),
  customerPic: text("customerPic"),
  mediaUrl: text("mediaUrl"),
  mediaType: text("mediaType"),
  review: text("review").notNull(),
  rating: integer("rating").default(5).notNull(),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  productId: text("productId").references(() => product.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

// ==========================================
// RELATIONS
// ==========================================
export const customerReviewRelations = relations(customerReview, ({ one }) => ({
  product: one(product, {
    fields: [customerReview.productId],
    references: [product.id],
  }),
}));

// ==========================================
// TYPES
// ==========================================
export type CustomerReview = typeof customerReview.$inferSelect;
export type InsertCustomerReview = typeof customerReview.$inferInsert;

