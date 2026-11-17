import {
  pgTable,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const promoDiscountTypeEnum = pgEnum("PromoDiscountType", [
  "PERCENTAGE",
  "FIXED",
]);
export type PromoDiscountType = (typeof promoDiscountTypeEnum.enumValues)[number];

export const promoCode = pgTable(
  "PromoCode",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: text("code").notNull().unique(),
    description: text("description"),
    discountType: promoDiscountTypeEnum("discountType").default("PERCENTAGE").notNull(),
    discountValue: numeric("discountValue", { precision: 12, scale: 2 }).notNull(),
    maxDiscountAmount: numeric("maxDiscountAmount", { precision: 12, scale: 2 }),
    minOrderAmount: numeric("minOrderAmount", { precision: 12, scale: 2 }).default("0").notNull(),
    usageLimit: integer("usageLimit"),
    usedCount: integer("usedCount").default(0).notNull(),
    startsAt: timestamp("startsAt", { mode: "date" }),
    expiresAt: timestamp("expiresAt", { mode: "date" }),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("promoCode_code_idx").on(table.code),
    index("promoCode_isActive_idx").on(table.isActive),
  ]
);

export type PromoCode = typeof promoCode.$inferSelect;
export type InsertPromoCode = typeof promoCode.$inferInsert;
