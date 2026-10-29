import {
  pgTable,
  text,
  timestamp,
  numeric,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// ==========================================
// ENUMS
// ==========================================
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

// ==========================================
// TABLES
// ==========================================
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

// ==========================================
// TYPES
// ==========================================
export type Expense = typeof expense.$inferSelect;
export type InsertExpense = typeof expense.$inferInsert;

export type Payment = typeof payment.$inferSelect;
export type InsertPayment = typeof payment.$inferInsert;

export type Sale = typeof sale.$inferSelect;
export type InsertSale = typeof sale.$inferInsert;

