import { db } from "@/db";
import { sale } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { serializeSale } from "./_shared";

export class DeleteSaleUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(id: string) {
    try {
      const [deleted] = await this.dbInstance.delete(sale).where(eq(sale.id, id)).returning({ id: sale.id });
      if (!deleted) {
        return { success: false as const, error: "Sale not found", message: "Sale not found" };
      }
      return { success: true as const, data: undefined };
    } catch (err: any) {
      console.error("DeleteSaleUseCase failed:", err);
      const msg = err?.message || "Failed to delete sale";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

export class GetSaleUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(id: string) {
    try {
      const [found] = await this.dbInstance.select().from(sale).where(eq(sale.id, id)).limit(1);
      if (!found) {
        return { success: false as const, error: "Sale not found", message: "Sale not found" };
      }
      return { success: true as const, data: serializeSale(found) };
    } catch (err: any) {
      console.error("GetSaleUseCase failed:", err);
      const msg = err?.message || "Failed to get sale";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

