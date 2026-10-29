import type { Metadata } from "next";
import { Suspense } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { SignUpForm } from "../_components/sign-up-form";
import { tokens } from "@/theme/theme";

export const metadata: Metadata = {
  title: "Create Account | We Gadget BD",
  description: "Join We Gadget BD to manage your orders, official warranty, and track deliveries.",
};

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
            borderRadius: "20px",
            bgcolor: "#ffffff",
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
