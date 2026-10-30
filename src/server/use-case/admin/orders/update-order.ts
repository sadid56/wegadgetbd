import { db } from "@/db";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

export class UpdateOrderUseCase {
  constructor(
    private readonly dbInstance: Context["db"] = db,
    private readonly actorId: string = "admin"
  ) {}

  async execute(id: string, data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {};

    if (data.customerName) payload.customerName = String(data.customerName).trim();
    if (data.phoneNumber) payload.phoneNumber = String(data.phoneNumber).trim();
    if (data.address) payload.address = String(data.address).trim();
    if (data.notes !== undefined) payload.notes = data.notes ? String(data.notes).trim() : null;
    if (data.status) payload.status = data.status;

    if (!Object.keys(payload).length) {
      return { success: false as const, error: "No fields to update", message: "No fields to update" };
    }

    const [updated] = await this.dbInstance.update(order).set(payload).where(eq(order.id, id)).returning();
    if (!updated) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }

    await writeAudit(this.dbInstance, {
      actorId: this.actorId,
      action: "UPDATE",
      targetType: "ORDER",
      targetId: id,
      metadata: payload,
    });

    return { success: true as const, data: updated };
  }
}

