import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import CartPage from "./_components/cart-page-client";

export const metadata: Metadata = buildPublicMetadata({
  title: "Shopping Cart",
  description: "Review your selected products, update quantities, and continue to secure checkout.",
  path: "/cart",
  noIndex: true,
});

export default function Cart() {
  return <CartPage />;
}
