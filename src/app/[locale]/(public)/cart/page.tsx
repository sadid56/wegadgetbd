import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import CartPage from "./_components/cart-page-client";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "শপিং কার্ট" : "Shopping Cart",
    description: locale === "bn"
      ? "আপনার নির্বাচিত পণ্যগুলো দেখুন, পরিমাণ পরিবর্তন করুন এবং নিরাপদে চেকআউট সম্পন্ন করুন।"
      : "Review your selected products, update quantities, and continue to secure checkout.",
    path: locale === "bn" ? "/bn/cart" : "/cart",
    noIndex: true,
  });
}

export default function Cart() {
  return <CartPage />;
}
