import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/spinner";
import { SignInForm } from "../_components/sign-in-form";
import { tokens } from "@/theme/theme";

export const metadata: Metadata = {
  title: "Sign In | We Gadget BD",
  description: "Sign in to access your We Gadget BD account, orders, and warranty.",
};

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
