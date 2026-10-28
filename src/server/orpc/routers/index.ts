import { productsRouter } from "./products";
import { categoriesRouter } from "./categories";
import { adminRouter } from "./admin";
export const appRouter = {
  products: productsRouter,
  categories: categoriesRouter,
  admin: adminRouter,
};

export type AppRouter = typeof appRouter;
