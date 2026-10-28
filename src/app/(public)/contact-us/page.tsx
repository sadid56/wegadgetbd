"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { useTheme } from "next-themes";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { FAQ } from "@/components/common/FAQ";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const BN_FONT = "'Hind Siliguri','Noto Sans Bengali',system-ui,sans-serif";

const contactInfo = [
  {
    Icon: PhoneOutlinedIcon,
    title: "ফোন করুন",
    value: "+8801576641142",
    description: "যেকোনো জিজ্ঞাসায় আমাদের কল করুন",
    href: "tel:+8801576641142",
  },
  {
    Icon: MailOutlinedIcon,
    title: "ইমেইল",
    value: "contact@bongonex.com",
    description: "ইমেইল এর মাধ্যমে আমাদের সাথে যোগাযোগ করুন",
    href: "mailto:bongonexbd@gmail.com",
  },
  {
    Icon: PlaceOutlinedIcon,
    title: "ঠিকানা",
    value: "লেভেল ৪, হাউস ১২, রোড ৭, ধানমন্ডি, ঢাকা",
    description: "সরাসরি আমাদের অফিসে ভিজিট করতে পারেন",
    href: "https://maps.google.com",
  },
] as const;

export default function ContactUsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: 10,
        overflow: "hidden",
        position: "relative",
        fontFamily: BN_FONT,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 500,
          height: 500,
          bgcolor: (theme) => alpha(theme.palette.primary.main, isDark ? 0.1 : 0.05),
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 500,
          height: 500,
          bgcolor: (theme) => alpha(theme.palette.primary.main, isDark ? 0.1 : 0.05),
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 10,
            animation: `${fadeUp} 600ms ease-out both`,
          }}
        >
          <Typography
            component='h1'
            sx={{
              fontSize: { xs: "2.5rem", md: "4.5rem" },
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              mb: 3,
              lineHeight: 1.05,
              color: "text.primary",
            }}
          >
            আমাদের সাথে{" "}
            <Box
              component='span'
              sx={{
                color: "text.disabled",
                WebkitTextStroke: "1px currentColor",
              }}
            >
              যোগাযোগ
            </Box>{" "}
            করুন
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              maxWidth: 672,
              mx: "auto",
              fontWeight: 300,
              lineHeight: 1.65,
              color: "text.secondary",
            }}
          >
            আপনার যেকোনো প্রশ্ন বা মতামতের জন্য আমরা সবসময় প্রস্তুত। নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 4,
            mb: 10,
          }}
        >
          {contactInfo.map(({ Icon, title, value, description, href }, index) => (
            <Box
              key={title}
              component='a'
              href={href}
              sx={{
                display: "block",
                p: 5,
                bgcolor: (theme) => alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "40px",
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
                transition: "background-color 300ms",
                animation: `${fadeUp} 500ms ease-out ${index * 100}ms both`,
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.text.primary, isDark ? 0.04 : 0.06),
                  "& .contact-decorative-icon": {
                    transform: "scale(1.1)",
                  },
                  "& .contact-icon-wrap": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <Box
                className='contact-decorative-icon'
                sx={{
                  position: "absolute",
                  right: -16,
                  top: -16,
                  color: (theme) => alpha(theme.palette.primary.main, 0.05),
                  transition: "transform 500ms",
                }}
              >
                <Icon sx={{ fontSize: 24 }} />
              </Box>

              <Box
                className='contact-icon-wrap'
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                  transition: "background-color 300ms, color 300ms",
                }}
              >
                <Icon sx={{ fontSize: 24 }} />
              </Box>

              <Typography
                component='h3'
                sx={{
                  fontSize: 20,
                  fontWeight: 900,
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                {value}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.secondary",
                }}
              >
                {description}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: "100%",
            height: { xs: 320, md: 384 },
            mb: 10,
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            animation: `${fadeUp} 700ms ease-out both`,
          }}
        >
          <Box
            component='iframe'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.890641050765!2d90.38933831543153!3d23.749099984589697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8bd47433d6f%3A0x3c21f5c22d50f0a!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1690000000000!5m2!1sen!2sbd'
            title='Office Location'
            allowFullScreen
            loading='lazy'
            sx={{ width: "100%", height: "100%", border: 0 }}
          />
        </Box>

        <Box sx={{ mb: 10 }}>
          <FAQ />
        </Box>
      </Container>
    </Box>
  );
}
