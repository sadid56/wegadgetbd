import Box from "@mui/material/Box";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin-auth";
import { Sidebar } from "./_components/Sidebar";
import { AdminHeader } from "./_components/AdminHeader";

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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <AdminHeader user={session.user} />
        <Box
          component='main'
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            gap: { xs: 2, lg: 3 },
            p: { xs: 2, lg: 3 },
            overflowY: "auto",
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
