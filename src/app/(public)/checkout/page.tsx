import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import CheckoutPage from "./_components/checkout-page-client";

export const metadata: Metadata = buildPublicMetadata({
  title: "Checkout",
  description: "Complete your order securely with fast delivery and cash-on-delivery support.",
  path: "/checkout",
  noIndex: true,
});

export default function Checkout() {
  return <CheckoutPage />;
}
