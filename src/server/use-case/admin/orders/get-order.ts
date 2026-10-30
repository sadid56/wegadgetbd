import { db } from "@/db";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";

export class GetOrderUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(id: string) {
    const [found] = await this.dbInstance.select().from(order).where(eq(order.id, id)).limit(1);
    if (!found) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }
    return { success: true as const, data: found };
  }
}

