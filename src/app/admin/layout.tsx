import * as React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import { CircularProgress } from "@/components/ui/spinner";

import { requireAdmin } from "@/lib/auth";
import { AdminDashboardLayout } from "../../components/layouts/admin-dashboard-layout";
import { RootDocumentShell, rootViewport } from "@/components/layouts/root-document-shell";
import { tokens } from "@/theme/theme";

export const viewport = rootViewport;

export const metadata: Metadata = {
  title: "Admin Dashboard | We Gadget BD",
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
    <RootDocumentShell locale="en">
      <React.Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              bgcolor: tokens.bgCanvas,
            }}
          >
            <CircularProgress size={36} sx={{ color: tokens.primary }} />
          </Box>
        }
      >
        <AdminDashboardLayout user={session.user}>
          {children}
        </AdminDashboardLayout>
      </React.Suspense>
    </RootDocumentShell>
  );
}
