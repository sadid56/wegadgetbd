import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/spinner";
import { SignInForm } from "../_components/sign-in-form";
import { tokens } from "@/theme/theme";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "bn" ? "লগইন করুন | We Gadget BD" : "Sign In | We Gadget BD",
    description: locale === "bn"
      ? "আপনার We Gadget BD একাউন্টে লগইন করে অর্ডার ও ওয়ারেন্টি ট্র্যাক করুন।"
      : "Sign in to access your We Gadget BD account, orders, and warranty.",
  };
}

export default function SignInPage() {
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
      <SignInForm />
    </Suspense>
  );
}
