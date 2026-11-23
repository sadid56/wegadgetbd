import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "../_components/sign-up-form";
import { AuthFormSkeleton } from "../_components/auth-form-skeleton";

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
    <Suspense fallback={<AuthFormSkeleton type='signup' />}>
      <SignUpForm />
    </Suspense>
  );
}
