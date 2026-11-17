import Box from "@mui/material/Box";
import { tokens } from "@/theme/theme";
import { Navbar } from "@/components/layouts/navbar/navbar";
import { Footer } from "@/components/layouts/Footer";
import { FloatingAiChat } from "@/components/common/FloatingAiChat";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        bgcolor: tokens.bgCanvas,
      }}
    >
      <Navbar />
      <Box
        component='main'
        sx={{
          flex: 1,
          pb: { xs: 3, md: 10, lg: 0 },
        }}
      >
        {children}
      </Box>
      <Footer />
      <FloatingAiChat />
    </Box>
  );
}
