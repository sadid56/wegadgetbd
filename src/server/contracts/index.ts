import { productsContract } from "./products.contract";
import { categoriesContract } from "./categories.contract";
import { adminContract } from "./admin.contract";
export const appContract = {
  products: productsContract,
  categories: categoriesContract,
  admin: adminContract,
};

export type AppContract = typeof appContract;
