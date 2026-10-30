import { db } from "@/db";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

export class DeleteOrderUseCase {
  constructor(
    private readonly dbInstance: Context["db"] = db,
    private readonly actorId: string = "admin"
  ) {}

  async execute(id: string) {
    const [deleted] = await this.dbInstance.delete(order).where(eq(order.id, id)).returning({ id: order.id });
    if (!deleted) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }

    await writeAudit(this.dbInstance, {
      actorId: this.actorId,
      action: "DELETE",
      targetType: "ORDER",
      targetId: id,
    });

    return { success: true as const, data: undefined };
  }
}

