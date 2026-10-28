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

// ==========================================
// ENUMS
// ==========================================
export const roleEnum = pgEnum("Role", ["USER", "ADMIN"]);
export type Role = (typeof roleEnum.enumValues)[number];

export const productStatusEnum = pgEnum("ProductStatus", ["PENDING", "ACTIVE", "INACTIVE"]);
export type ProductStatus = (typeof productStatusEnum.enumValues)[number];

export const productLabelEnum = pgEnum("ProductLabel", ["NONE", "NEW", "SPECIAL", "BEST_SELLER"]);
export type ProductLabel = (typeof productLabelEnum.enumValues)[number];

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

export const reviewStatusEnum = pgEnum("ReviewStatus", ["PENDING", "APPROVED", "REJECTED"]);
export type ReviewStatus = (typeof reviewStatusEnum.enumValues)[number];

export const paymentMethodEnum = pgEnum("PaymentMethod", [
  "CASH",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "BANK_TRANSFER",
  "OTHER",
]);
export type PaymentMethod = (typeof paymentMethodEnum.enumValues)[number];

export const paymentStatusEnum = pgEnum("PaymentStatus", [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

export const orderStatusEnum = pgEnum("OrderStatus", [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
]);
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];



// ==========================================
// TABLES
// ==========================================

export const user = pgTable("User", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: roleEnum("role").default("USER").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  banned: boolean("banned").default(false).notNull(),
  banReason: text("banReason"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

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

export const expense = pgTable("Expense", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  note: text("note"),
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

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

export const payment = pgTable("Payment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").default("CASH").notNull(),
  status: paymentStatusEnum("status").default("COMPLETED").notNull(),
  transactionId: text("transactionId"),
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sale = pgTable("Sale", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productName: text("productName").notNull(),
  customerName: text("customerName").notNull(),
  phoneNumber: text("phoneNumber"),
  address: text("address"),
  sellerName: text("sellerName"),
  quantity: integer("quantity").notNull(),
  buyPrice: numeric("buyPrice", { precision: 12, scale: 2 }).default("0").notNull(),
  sellPrice: numeric("sellPrice", { precision: 12, scale: 2 }).default("0").notNull(),
  boostingCost: numeric("boostingCost", { precision: 12, scale: 2 }).default("0").notNull(),
  profit: numeric("profit", { precision: 12, scale: 2 }).default("0").notNull(),
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  status: text("status").default("COMPLETED").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});


export const order = pgTable(
  "Order",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerName: text("customerName").notNull(),
    phoneNumber: text("phoneNumber").notNull(),
    address: text("address").notNull(),
    city: text("city"),
    area: text("area"),
    items: jsonb("items").notNull(),
    totalAmount: numeric("totalAmount", { precision: 12, scale: 2 }).notNull(),
    shippingCost: numeric("shippingCost", { precision: 12, scale: 2 }).default("0").notNull(),
    discountAmount: numeric("discountAmount", { precision: 12, scale: 2 }).default("0").notNull(),
    paymentMethod: text("paymentMethod").default("CASH_ON_DELIVERY").notNull(),
    status: orderStatusEnum("status").default("PENDING").notNull(),
    userAgent: text("userAgent"),
    ipAddress: text("ipAddress"),
    userId: text("userId").references(() => user.id),
    notes: text("notes"),
    whatsappMessage: text("whatsappMessage"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("order_status_idx").on(table.status),
    index("order_userId_idx").on(table.userId),
  ]
);

// ==========================================
// RELATIONS
// ==========================================

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  auditLogs: many(auditLog),
  orders: many(order),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

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

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, {
    fields: [auditLog.actorId],
    references: [user.id],
  }),
}));

export const customerReviewRelations = relations(customerReview, ({ one }) => ({
  product: one(product, {
    fields: [customerReview.productId],
    references: [product.id],
  }),
}));

export const orderRelations = relations(order, ({ one }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
}));

// Types
export type User = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type InsertSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type InsertAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type InsertVerification = typeof verification.$inferInsert;

export type Category = typeof category.$inferSelect;
export type InsertCategory = typeof category.$inferInsert;

export type Product = typeof product.$inferSelect;
export type InsertProduct = typeof product.$inferInsert;

export type Expense = typeof expense.$inferSelect;
export type InsertExpense = typeof expense.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;

export type HomepageContent = typeof homepageContent.$inferSelect;
export type InsertHomepageContent = typeof homepageContent.$inferInsert;

export type CustomerReview = typeof customerReview.$inferSelect;
export type InsertCustomerReview = typeof customerReview.$inferInsert;

export type Payment = typeof payment.$inferSelect;
export type InsertPayment = typeof payment.$inferInsert;

export type Sale = typeof sale.$inferSelect;
export type InsertSale = typeof sale.$inferInsert;


export type Order = typeof order.$inferSelect;
export type InsertOrder = typeof order.$inferInsert;
