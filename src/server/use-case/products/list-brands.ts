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

      const rawRes = res as unknown as { rows?: Array<{ name: unknown; count: unknown }> } | Array<{ name: unknown; count: unknown }>;
      const rows = Array.isArray(rawRes) ? rawRes : rawRes?.rows || [];
      return rows.map((r: { name: unknown; count: unknown }) => ({
        name: String(r.name).trim(),
        count: Number(r.count),
      }));
    } catch {
      return [];
    }
  }
}

