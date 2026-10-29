import * as React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { requireAdmin } from "@/lib/auth";
import { AdminDashboardLayout } from "../../components/layouts/admin-dashboard-layout";

export const metadata: Metadata = {
  title: "Admin Dashboard | BongoNex",
  description: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <React.Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress size={36} sx={{ color: "primary.main" }} />
        </Box>
      }
    >
      <AdminDashboardLayout user={session.user}>
        {children}
      </AdminDashboardLayout>
    </React.Suspense>
  );
}
