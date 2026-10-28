import { categoriesContract } from "@/server/contracts/categories.contract";
import { implementPublic, implementAdmin } from "../init";
import { category, product } from "@/db/schema";
import { eq, asc, count } from "drizzle-orm";

export const categoriesRouter = {
  list: implementPublic(categoriesContract.list).handler(async ({ context }) => {
    const categoriesWithCount = await context.db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        productCount: count(product.id),
      })
      .from(category)
      .leftJoin(product, eq(product.categoryId, category.id))
      .groupBy(category.id)
      .orderBy(asc(category.name));

    return categoriesWithCount.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      _count: { products: Number(c.productCount) },
    }));
  }),

  bySlug: implementPublic(categoriesContract.bySlug).handler(async ({ input, context }) => {
    const result = await context.db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        productCount: count(product.id),
      })
      .from(category)
      .leftJoin(product, eq(product.categoryId, category.id))
      .where(eq(category.slug, input.slug))
      .groupBy(category.id)
      .limit(1);

    if (!result.length) return null;

    const c = result[0];
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      _count: { products: Number(c.productCount) },
    };
  }),

  create: implementAdmin(categoriesContract.create).handler(async ({ input, context }) => {
    const [newCategory] = await context.db
      .insert(category)
      .values({
        name: input.name,
        slug: input.slug,
        icon: input.icon ?? null,
      })
      .returning();

    return newCategory;
  }),

  update: implementAdmin(categoriesContract.update).handler(async ({ input, context }) => {
    const { id, data } = input;
    const [updatedCategory] = await context.db
      .update(category)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.icon !== undefined && { icon: data.icon }),
      })
      .where(eq(category.id, id))
      .returning();

    return updatedCategory;
  }),

  delete: implementAdmin(categoriesContract.delete).handler(async ({ input, context }) => {
    const [deletedCategory] = await context.db
      .delete(category)
      .where(eq(category.id, input.id))
      .returning();

    return deletedCategory;
  }),
};
