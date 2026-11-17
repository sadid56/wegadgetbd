import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { promoCode } from "@/db/schema";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

export class DeletePromoCodeUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string, userId?: string) {
    const existing = await this.db.query.promoCode.findFirst({
      where: eq(promoCode.id, id),
      columns: { id: true, code: true },
    });

    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Promo code not found." });
    }

    await this.db.delete(promoCode).where(eq(promoCode.id, id));

    await writeAudit(this.db, {
      actorId: userId,
      actorType: "ADMIN",
      action: "DELETE",
      metadata: { entity: "PROMO_CODE", id: existing.id, code: existing.code },
    });

    return { success: true, id: existing.id };
  }
}
