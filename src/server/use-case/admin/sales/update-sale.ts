import { db } from "@/db";
import { sale } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import {
  calculateProfit,
  serializeSale,
  validateSaleInput,
  type UpdateSaleInput,
} from "./_shared";

export class UpdateSaleUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(id: string, input: UpdateSaleInput) {
    const error = validateSaleInput(input as any, { partial: true });
    if (error) {
      return { success: false as const, error, message: error };
    }

    try {
      const [existing] = await this.dbInstance.select().from(sale).where(eq(sale.id, id)).limit(1);
      if (!existing) {
        return { success: false as const, error: "Sale not found", message: "Sale not found" };
      }

      const quantity = input.quantity ?? existing.quantity;
      const buyPrice = input.buyPrice ?? Number(existing.buyPrice);
      const sellPrice = input.sellPrice ?? Number(existing.sellPrice);
      const boostingCost = input.boostingCost ?? Number(existing.boostingCost);

      const profit = calculateProfit({
        quantity,
        buyPrice,
        sellPrice,
        boostingCost,
      });

      const updateData: Record<string, unknown> = {
        quantity,
        buyPrice: String(buyPrice),
        sellPrice: String(sellPrice),
        boostingCost: String(boostingCost),
        profit: String(profit),
      };

      if (input.productName !== undefined) updateData.productName = input.productName.trim();
      if (input.customerName !== undefined) updateData.customerName = input.customerName.trim();
      if (input.phoneNumber !== undefined) updateData.phoneNumber = input.phoneNumber?.trim() || null;
      if (input.address !== undefined) updateData.address = input.address?.trim() || null;
      if (input.sellerName !== undefined) updateData.sellerName = input.sellerName?.trim() || null;
      if (input.date !== undefined) updateData.date = input.date;
      if (input.status !== undefined) updateData.status = input.status;

      const [updated] = await this.dbInstance.update(sale).set(updateData).where(eq(sale.id, id)).returning();
      return { success: true as const, data: serializeSale(updated) };
    } catch (err: any) {
      console.error("UpdateSaleUseCase failed:", err);
      const msg = err?.message || "Failed to update sale";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

