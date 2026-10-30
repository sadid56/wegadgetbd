import { db } from "@/db";
import { order, type OrderStatus } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly dbInstance: Context["db"] = db,
    private readonly actorId: string = "admin"
  ) {}

  async execute(id: string, status: OrderStatus) {
    const [updated] = await this.dbInstance
      .update(order)
      .set({ status })
      .where(eq(order.id, id))
      .returning();

    if (!updated) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }

    await writeAudit(this.dbInstance, {
      actorId: this.actorId,
      action: "UPDATE",
      targetType: "ORDER",
      targetId: id,
      metadata: { status },
    });

    return { success: true as const, data: updated };
  }
}

