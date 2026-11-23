import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "../_components/sign-in-form";
import { AuthFormSkeleton } from "../_components/auth-form-skeleton";

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
    <Suspense fallback={<AuthFormSkeleton type='signin' />}>
      <SignInForm />
    </Suspense>
  );
}
