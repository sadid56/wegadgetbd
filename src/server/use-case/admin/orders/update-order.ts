import { after } from "next/server";
import { db } from "@/db";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { buildOrderNotificationFromRow, discordNotifier } from "@/server/lib/discord";

export class UpdateOrderUseCase {
  constructor(
    private readonly dbInstance: Context["db"] = db,
    private readonly _actorId: string = "admin"
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

    const [existing] = await this.dbInstance
      .select({
        status: order.status,
        discordMessageId: order.discordMessageId,
      })
      .from(order)
      .where(eq(order.id, id));

    if (!existing) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }

    const [updated] = await this.dbInstance.update(order).set(payload).where(eq(order.id, id)).returning();
    if (!updated) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }

    const syncDiscord = async () => {
      try {
        const nextMessageId = await discordNotifier.syncOrderStatus(
          buildOrderNotificationFromRow(updated),
          {
            messageId: existing.discordMessageId,
            previousStatus: existing.status,
          }
        );

        if (nextMessageId && nextMessageId !== existing.discordMessageId) {
          await this.dbInstance
            .update(order)
            .set({ discordMessageId: nextMessageId })
            .where(eq(order.id, updated.id));
        }
      } catch (err) {
        console.error("Failed to sync Discord order update:", err);
      }
    };

    try {
      after(syncDiscord);
    } catch {
      void syncDiscord();
    }

    return { success: true as const, data: updated };
  }
}

