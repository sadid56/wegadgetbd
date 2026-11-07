import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { product } from "./products";
import { user } from "./auth";

// ==========================================
// ENUMS
// ==========================================
export const reviewStatusEnum = pgEnum("ReviewStatus", ["PENDING", "APPROVED", "REJECTED"]);
export type ReviewStatus = (typeof reviewStatusEnum.enumValues)[number];

// ==========================================
// LEGACY / ADMIN TESTIMONIAL REVIEWS
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
  isDeleted: boolean("isDeleted").default(false).notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

// ==========================================
// INTERACTIVE PRODUCT REVIEWS & DISCUSSIONS
// ==========================================
export const productReview = pgTable(
  "ProductReview",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text("productId")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    userId: text("userId").references(() => user.id, { onDelete: "set null" }),
    userName: text("userName").notNull(),
    userAvatar: text("userAvatar"),
    rating: integer("rating").default(5).notNull(),
    title: text("title"),
    comment: text("comment").notNull(),
    images: text("images")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    likesCount: integer("likesCount").default(0).notNull(),
    isVerifiedPurchase: boolean("isVerifiedPurchase").default(false).notNull(),
    isDeleted: boolean("isDeleted").default(false).notNull(),
    deletedAt: timestamp("deletedAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("product_review_productId_idx").on(table.productId),
  ]
);

// Nested replies to reviews (can reply to review or another reply via parentId)
export const reviewReply = pgTable(
  "ReviewReply",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    reviewId: text("reviewId")
      .notNull()
      .references(() => productReview.id, { onDelete: "cascade" }),
    parentId: text("parentId").references((): any => reviewReply.id, { onDelete: "cascade" }),
    userId: text("userId").references(() => user.id, { onDelete: "set null" }),
    userName: text("userName").notNull(),
    userAvatar: text("userAvatar"),
    userRole: text("userRole").default("USER").notNull(),
    comment: text("comment").notNull(),
    likesCount: integer("likesCount").default(0).notNull(),
    isDeleted: boolean("isDeleted").default(false).notNull(),
    deletedAt: timestamp("deletedAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("review_reply_reviewId_idx").on(table.reviewId),
    index("review_reply_parentId_idx").on(table.parentId),
  ]
);

// Helpful / Like tracking for reviews (prevent duplicate likes)
export const reviewLike = pgTable(
  "ReviewLike",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    reviewId: text("reviewId")
      .notNull()
      .references(() => productReview.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    unique("review_like_unique_user_review").on(table.reviewId, table.userId),
    index("review_like_reviewId_idx").on(table.reviewId),
  ]
);

// ==========================================
// RELATIONS
// ==========================================
export const customerReviewRelations = relations(customerReview, ({ one }) => ({
  product: one(product, {
    fields: [customerReview.productId],
    references: [product.id],
  }),
}));

export const productReviewRelations = relations(productReview, ({ one, many }) => ({
  product: one(product, {
    fields: [productReview.productId],
    references: [product.id],
  }),
  user: one(user, {
    fields: [productReview.userId],
    references: [user.id],
  }),
  replies: many(reviewReply),
  likes: many(reviewLike),
}));

export const reviewReplyRelations = relations(reviewReply, ({ one, many }) => ({
  review: one(productReview, {
    fields: [reviewReply.reviewId],
    references: [productReview.id],
  }),
  parent: one(reviewReply, {
    fields: [reviewReply.parentId],
    references: [reviewReply.id],
    relationName: "NestedReplies",
  }),
  children: many(reviewReply, {
    relationName: "NestedReplies",
  }),
  user: one(user, {
    fields: [reviewReply.userId],
    references: [user.id],
  }),
}));

export const reviewLikeRelations = relations(reviewLike, ({ one }) => ({
  review: one(productReview, {
    fields: [reviewLike.reviewId],
    references: [productReview.id],
  }),
  user: one(user, {
    fields: [reviewLike.userId],
    references: [user.id],
  }),
}));

// ==========================================
// TYPES
// ==========================================
export type CustomerReview = typeof customerReview.$inferSelect;
export type InsertCustomerReview = typeof customerReview.$inferInsert;

export type ProductReview = typeof productReview.$inferSelect;
export type InsertProductReview = typeof productReview.$inferInsert;

export type ReviewReply = typeof reviewReply.$inferSelect;
export type InsertReviewReply = typeof reviewReply.$inferInsert;

export type ReviewLike = typeof reviewLike.$inferSelect;
export type InsertReviewLike = typeof reviewLike.$inferInsert;
