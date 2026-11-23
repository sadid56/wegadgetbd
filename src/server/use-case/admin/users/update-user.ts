import { eq } from "drizzle-orm";
import { user, type Role } from "@/db/schema";
import type { Context } from "@/server/context";

export interface UpdateUserInput {
  id: string;
  banned?: boolean;
  role?: string;
  banReason?: string | null;
}

export class UpdateUserUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly _actorId: string,
  ) {}

  async execute({ id, banned, role, banReason }: UpdateUserInput) {
    const [updated] = await this.db
      .update(user)
      .set({
        ...(banned !== undefined && { banned }),
        ...(role && { role: role as Role }),
        ...(banReason !== undefined && { banReason }),
      })
      .where(eq(user.id, id))
      .returning();

    return updated;
  }
}
