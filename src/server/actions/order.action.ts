"use server";

import { db } from "@/db";
import { CreateOrderUseCase, type CreateOrderInput } from "@/server/use-case/orders/create-order";

export async function createOrder(input: CreateOrderInput) {
  const useCase = new CreateOrderUseCase(db);
  return useCase.execute(input);
}

