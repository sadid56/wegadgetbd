import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import CheckoutPage from "./_components/checkout-page-client";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "চেকআউট" : "Checkout",
    description: locale === "bn"
      ? "আপনার অর্ডারটি নিরাপদে সম্পন্ন করুন দ্রুত ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধাসহ।"
      : "Complete your order securely with fast delivery and cash-on-delivery support.",
    path: locale === "bn" ? "/bn/checkout" : "/checkout",
    noIndex: true,
  });
}

export default function Checkout() {
  return <CheckoutPage />;
}
