import { after } from "next/server";
import { db } from "@/db";
import { order, type OrderStatus } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { buildOrderNotificationFromRow, discordNotifier } from "@/server/lib/discord";

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly dbInstance: Context["db"] = db,
    private readonly _actorId: string = "admin"
  ) {}

  async execute(id: string, status: OrderStatus) {
    const [existing] = await this.dbInstance
      .select({
        id: order.id,
        status: order.status,
        discordMessageId: order.discordMessageId,
      })
      .from(order)
      .where(eq(order.id, id));

    if (!existing) {
      return { success: false as const, error: "Order not found", message: "Order not found" };
    }

    const [updated] = await this.dbInstance
      .update(order)
      .set({ status })
      .where(eq(order.id, id))
      .returning();

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
        console.error("Failed to sync Discord order status:", err);
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

