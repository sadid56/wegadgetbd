import {
  pgTable,
  text,
  timestamp,
  numeric,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// ==========================================
// ENUMS
// ==========================================
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
export const orderRelations = relations(order, ({ one }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
}));

// ==========================================
// TYPES
// ==========================================
export type Order = typeof order.$inferSelect;
export type InsertOrder = typeof order.$inferInsert;

