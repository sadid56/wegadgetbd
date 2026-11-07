import { sql } from "drizzle-orm";
import type { Context } from "@/server/context";

export class ListBrandsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute() {
    try {
      const res = await this.db.execute<{ name: string; count: string | number }>(sql`
        SELECT (elem->>'value') as name, count(*)::int as count
        FROM "Product", jsonb_array_elements("specifications") as elem
        WHERE "status" = 'ACTIVE' 
          AND "isDeleted" = false
          AND jsonb_typeof("specifications") = 'array'
          AND LOWER(elem->>'key') = 'brand'
          AND TRIM(elem->>'value') != ''
        GROUP BY 1
        ORDER BY count DESC
      `);

      const rows = (res as any)?.rows || res || [];
      return rows.map((r: any) => ({
        name: String(r.name).trim(),
        count: Number(r.count),
      }));
    } catch {
      return [];
    }
  }
}

