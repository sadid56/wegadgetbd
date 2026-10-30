import { productsRouter } from "./products.router";
import { categoriesRouter } from "./categories.router";
import { adminRouter } from "./admin.router";
import { ordersRouter } from "./orders.router";
import { salesRouter } from "./sales.router";
import { expensesRouter } from "./expenses.router";
import { paymentsRouter } from "./payments.router";

export const appRouter = {
  products: productsRouter,
  categories: categoriesRouter,
  admin: adminRouter,
  orders: ordersRouter,
  sales: salesRouter,
  expenses: expensesRouter,
  payments: paymentsRouter,
};

export type AppRouter = typeof appRouter;

export {
  productsRouter,
  categoriesRouter,
  adminRouter,
  ordersRouter,
  salesRouter,
  expensesRouter,
  paymentsRouter,
};
