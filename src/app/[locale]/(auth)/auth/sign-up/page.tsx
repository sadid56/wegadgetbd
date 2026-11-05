import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/spinner";
import { SignUpForm } from "../_components/sign-up-form";
import { tokens } from "@/theme/theme";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "bn" ? "অ্যাকাউন্ট তৈরি করুন | We Gadget BD" : "Create Account | We Gadget BD",
    description: locale === "bn"
      ? "We Gadget BD-এ অ্যাকাউন্ট তৈরি করে সহজেই অর্ডার ও অফিসিয়াল ওয়ারেন্টি ট্র্যাক করুন।"
      : "Join We Gadget BD to manage your orders, official warranty, and track deliveries.",
  };
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <Card
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 320,
            borderRadius: `${tokens.radiusXl}px`,
            bgcolor: tokens.bgPanel,
          }}
        >
          <CircularProgress size={32} sx={{ color: tokens.primary }} />
        </Card>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
