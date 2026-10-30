import { db } from "@/db";
import { sale } from "@/db/schema";
import { and, gte, inArray, eq } from "drizzle-orm";
import { isValidDate, isNonNegativeNumber, isPositiveInt } from "@/server/lib/action-utils";

export const MAX_PAGE_SIZE = 100;
export const MAX_NAME_LENGTH = 200;
export const MAX_ADDRESS_LENGTH = 500;
export const MAX_PHONE_LENGTH = 30;
export const SUCCESS_STATUSES = ["COMPLETED", "DELIVERED"] as const;
export const VALID_STATUSES = new Set(["PENDING", "COMPLETED", "DELIVERED", "CANCELLED", "RETURNED"]);
export const DEFAULT_STATUS = "COMPLETED";

export interface CreateSaleInput {
  productName: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  boostingCost: number;
  customerName: string;
  phoneNumber?: string;
  address?: string;
  sellerName?: string;
  date?: Date;
  status?: string;
}

export type UpdateSaleInput = Partial<CreateSaleInput>;

export const calculateProfit = ({
  quantity,
  buyPrice,
  sellPrice,
  boostingCost,
}: {
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  boostingCost: number;
}) => (sellPrice - buyPrice - boostingCost) * quantity;

export function serializeSale<
  T extends {
    buyPrice: unknown;
    sellPrice: unknown;
    boostingCost: unknown;
    profit: unknown;
  },
>(s: T) {
  return {
    ...s,
    buyPrice: Number(s.buyPrice),
    sellPrice: Number(s.sellPrice),
    boostingCost: Number(s.boostingCost),
    profit: Number(s.profit),
  };
}

export function validateSaleInput(input: CreateSaleInput, opts: { partial: boolean }): string | null {
  const check = (field: keyof CreateSaleInput) => !opts.partial || input[field] !== undefined;

  if (check("productName")) {
    const v = input.productName?.trim();
    if (!v) return "Product name is required";
    if (v.length > MAX_NAME_LENGTH) return "Product name is too long";
  }
  if (check("customerName")) {
    const v = input.customerName?.trim();
    if (!v) return "Customer name is required";
    if (v.length > MAX_NAME_LENGTH) return "Customer name is too long";
  }
  if (check("quantity") && !isPositiveInt(input.quantity)) return "Quantity must be a positive integer";
  if (check("buyPrice") && !isNonNegativeNumber(input.buyPrice)) return "Buy price must be a non-negative number";
  if (check("sellPrice") && !isNonNegativeNumber(input.sellPrice)) return "Sell price must be a non-negative number";
  if (check("boostingCost") && !isNonNegativeNumber(input.boostingCost)) return "Boosting cost must be a non-negative number";
  if (input.date !== undefined && !isValidDate(input.date)) return "Invalid sale date";
  if (input.status !== undefined && !VALID_STATUSES.has(input.status)) return "Invalid sale status";
  if (input.phoneNumber !== undefined && input.phoneNumber.length > MAX_PHONE_LENGTH) return "Phone number is too long";
  if (input.address !== undefined && input.address.length > MAX_ADDRESS_LENGTH) return "Address is too long";
  return null;
}

export async function getProductWiseStats(dbInstance: typeof db, { from, sellerName }: { from: Date; sellerName?: string }) {
  const conditions = [gte(sale.date, from), inArray(sale.status, SUCCESS_STATUSES as unknown as string[])];
  if (sellerName) conditions.push(eq(sale.sellerName, sellerName));

  const rows = await dbInstance
    .select({
      productName: sale.productName,
      quantity: sale.quantity,
      sellPrice: sale.sellPrice,
    })
    .from(sale)
    .where(and(...conditions));

  const map = new Map<string, { productName: string; soldQty: number; totalSellAmount: number }>();
  for (const row of rows) {
    const prev = map.get(row.productName) ?? {
      productName: row.productName,
      soldQty: 0,
      totalSellAmount: 0,
    };
    prev.soldQty += row.quantity;
    prev.totalSellAmount += Number(row.sellPrice) * row.quantity;
    map.set(row.productName, prev);
  }

  return Array.from(map.values()).sort((a, b) => b.totalSellAmount - a.totalSellAmount);
}

