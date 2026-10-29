import { productsRouter } from "./products.router";
import { categoriesRouter } from "./categories.router";
import { adminRouter } from "./admin.router";

export const appRouter = {
  products: productsRouter,
  categories: categoriesRouter,
  admin: adminRouter,
};

export type AppRouter = typeof appRouter;

export { productsRouter, categoriesRouter, adminRouter };
