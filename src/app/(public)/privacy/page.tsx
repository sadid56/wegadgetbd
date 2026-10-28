import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Privacy Policy",
  description: "Read how BongoNex collects, uses, and protects your personal information.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "user privacy"],
});

export default function PrivacyPage() {
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
            right: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            bgcolor: "rgba(96,165,250,0.1)",
            filter: "blur(120px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            bgcolor: "rgba(168,85,247,0.1)",
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
              mb: 2,
              lineHeight: 1.1,
              color: "text.primary",
            }}
          >
            PRIVACY{" "}
            <Box component='span' sx={{ color: "primary.main" }}>
              POLICY
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
          <Section title='1. Introduction'>
            <Typography>
              Welcome to <strong>BongoNex</strong>. We respect your privacy and are committed to protecting your personal data. This privacy
              policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy
              rights and how the law protects you.
            </Typography>
          </Section>

          <Section title='2. Data We Collect'>
            <Typography>We may collect, use, store and transfer different kinds of personal data about you, including:</Typography>
            <BulletList>
              <li>
                <strong>Identity Data:</strong> name, username.
              </li>
              <li>
                <strong>Contact Data:</strong> email address, telephone numbers, billing address.
              </li>
              <li>
                <strong>Technical Data:</strong> internet protocol (IP) address, login data, browser type and version.
              </li>
              <li>
                <strong>Usage Data:</strong> information about how you use our website, products and services.
              </li>
            </BulletList>
          </Section>

          <Section title='3. How We Use Your Data'>
            <Typography>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following
              circumstances:
            </Typography>
            <BulletList>
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </BulletList>
          </Section>

          <Section title='4. Data Security'>
            <Typography>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or
              accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees,
              agents, contractors and other third parties who have a business need to know.
            </Typography>
          </Section>

          <Section title='5. Your Legal Rights'>
            <Typography>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right
              to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the
              lawful ground of processing is consent) to withdraw consent.
            </Typography>
          </Section>

          <Section title='6. Contact Us'>
            <Typography>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              <br />
              <strong>Email:</strong> support@bongonex.com
              <br />
              <strong>Phone:</strong> +880 1784972403
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
