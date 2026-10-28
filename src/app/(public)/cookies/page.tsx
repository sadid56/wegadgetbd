import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Cookies Policy",
  description: "Understand how BongoNex uses cookies and similar technologies to improve your experience.",
  path: "/cookies",
  keywords: ["cookies policy", "tracking technologies", "website cookies"],
});

export default function CookiesPage() {
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
            // bgcolor: (theme) => (theme.palette.augmentColor ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.1)"),
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
            bgcolor: "rgba(99,102,241,0.1)",
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
            Cookies{" "}
            <Box component='span' sx={{ color: "primary.main" }}>
              Policy
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
          <Section title='1. What are Cookies'>
            <Typography>
              Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser
              and allows the website or a third-party to recognize you and make your next visit easier and the website more useful to you.
            </Typography>
          </Section>

          <Section title='2. How BongoNex Uses Cookies'>
            <Typography>
              When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the
              following purposes:
            </Typography>
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
              <li>
                <strong>Essential Cookies:</strong> We may use cookies to remember information that changes how the Service looks or
                behaves, such as a user&apos;s language preference on the Service.
              </li>
              <li>
                <strong>Account Related:</strong> If you create an account with us, we will use cookies for the management of the signup
                process and general administration.
              </li>
              <li>
                <strong>Login Related:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you
                from having to log in every single time you visit a new page.
              </li>
            </Box>
          </Section>

          <Section title='3. Third-party Cookies'>
            <Typography>
              In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service,
              deliver advertisements on and through the Service, and so on.
            </Typography>
          </Section>

          <Section title='4. Your Choices Regarding Cookies'>
            <Typography>
              If you&apos;d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of
              your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all
              of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
            </Typography>
          </Section>

          <Section title='5. More Information'>
            <Typography>
              You can learn more about cookies at AllAboutCookies:{" "}
              <Box
                component='a'
                href='http://www.allaboutcookies.org/'
                target='_blank'
                rel='noopener noreferrer'
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                allaboutcookies.org
              </Box>
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
