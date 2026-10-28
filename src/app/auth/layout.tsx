import type { Metadata } from "next";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "action.hover",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 448, display: "flex", flexDirection: "column", gap: 4 }}>{children}</Box>
    </Box>
  );
}
