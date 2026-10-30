import { db } from "@/db";
import { sale } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import {
  DEFAULT_STATUS,
  calculateProfit,
  serializeSale,
  validateSaleInput,
  type CreateSaleInput,
} from "./_shared";

export class CreateSaleUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: CreateSaleInput) {
    const error = validateSaleInput(input, { partial: false });
    if (error) {
      return { success: false as const, error, message: error };
    }

    try {
      const profit = calculateProfit({
        quantity: input.quantity,
        buyPrice: input.buyPrice,
        sellPrice: input.sellPrice,
        boostingCost: input.boostingCost,
      });

      const [newSale] = await this.dbInstance
        .insert(sale)
        .values({
          productName: input.productName.trim(),
          quantity: input.quantity,
          buyPrice: String(input.buyPrice),
          sellPrice: String(input.sellPrice),
          boostingCost: String(input.boostingCost),
          profit: String(profit),
          customerName: input.customerName.trim(),
          phoneNumber: input.phoneNumber?.trim() || null,
          address: input.address?.trim() || null,
          sellerName: input.sellerName?.trim() || null,
          date: input.date || new Date(),
          status: input.status || DEFAULT_STATUS,
        })
        .returning();

      return { success: true as const, data: serializeSale(newSale) };
    } catch (err: any) {
      console.error("CreateSaleUseCase failed:", err);
      const msg = err?.message || "Failed to create sale";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

