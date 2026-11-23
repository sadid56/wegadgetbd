import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { promoCode } from "@/db/schema";
import type { Context } from "@/server/context";

export class DeletePromoCodeUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string, _userId?: string) {
    const existing = await this.db.query.promoCode.findFirst({
      where: eq(promoCode.id, id),
      columns: { id: true, code: true },
    });

    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Promo code not found." });
    }

    await this.db.delete(promoCode).where(eq(promoCode.id, id));

    return { success: true, id: existing.id };
  }
}
