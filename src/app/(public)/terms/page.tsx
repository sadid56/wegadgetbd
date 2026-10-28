import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Terms of Service",
  description: "Review the terms and conditions for shopping and using services on BongoNex.",
  path: "/terms",
  keywords: ["terms of service", "ecommerce terms", "purchase policy"],
});

export default function TermsPage() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 10,
        px: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            bgcolor: "rgba(99,102,241,0.1)",
            filter: "blur(120px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            bgcolor: "rgba(96,165,250,0.1)",
            filter: "blur(120px)",
          }}
        />
      </Box>

      <Container maxWidth='md' sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 6 }}>
          <NextLink href='/' style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "inline-block",
                mb: 2,
                color: "primary.main",
                fontWeight: 500,
                textDecoration: "none",
                transition: "text-decoration 200ms",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              ← Back to Home
            </Box>
          </NextLink>

          <Typography
            component='h1'
            sx={{
              fontSize: { xs: "2.25rem", md: "3rem" },
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              mb: 2,
              lineHeight: 1.1,
              color: "text.primary",
            }}
          >
            Terms of{" "}
            <Box component='span' sx={{ color: "primary.main" }}>
              Service
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Last Updated: February 9, 2026
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.65,
            color: "text.secondary",
          }}
        >
          <Section title='1. Terms of Use'>
            <Typography>
              By accessing BongoNex, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree
              that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are
              prohibited from using or accessing this site.
            </Typography>
          </Section>

          <Section title='2. Use License'>
            <Typography>
              Permission is granted to temporarily download one copy of the materials (information or software) on BongoNex&apos;s website
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this
              license you may not:
            </Typography>
            <BulletList>
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on BongoNex&apos;s website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </BulletList>
          </Section>

          <Section title='3. E-Commerce Terms'>
            <Typography>
              When purchase products through BongoNex, you agree to provide current, complete, and accurate purchase and account
              information. We reserve the right to refuse any order you place with us. Prices for our products are subject to change without
              notice.
            </Typography>
          </Section>

          <Section title='4. Disclaimer'>
            <Typography>
              The materials on BongoNex&apos;s website are provided on an &apos;as is&apos; basis. BongoNex makes no warranties, expressed
              or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other
              violation of rights.
            </Typography>
          </Section>

          <Section title='5. Governing Law'>
            <Typography>
              These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit
              to the exclusive jurisdiction of the courts in that State or location.
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box component='section' sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography
        component='h2'
        sx={{
          fontSize: 20,
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function BulletList({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component='ul'
      sx={{
        pl: 3,
        m: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        listStyleType: "disc",
        "& li": { pl: 0.5 },
      }}
    >
      {children}
    </Box>
  );
}
