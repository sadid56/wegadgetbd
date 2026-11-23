import { and, type SQL } from "drizzle-orm";

export function buildWhere(conditions: (SQL | undefined)[]) {
  return conditions.length ? and(...conditions) : undefined;
}
