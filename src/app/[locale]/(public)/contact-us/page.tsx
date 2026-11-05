import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { tokens } from "@/theme/theme";
import { FAQ } from "@/components/common/FAQ";
import { buildPublicMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "যোগাযোগ করুন | We Gadget BD" : "Contact Us | We Gadget BD",
    description:
      locale === "bn"
        ? "যেকোনো জিজ্ঞাসা, অর্ডার বা সাপোর্টের জন্য We Gadget BD-এর সাথে যোগাযোগ করুন। ফোন, ইমেইল বা সরাসরি আমাদের অফিসে আসতে পারেন।"
        : "Get in touch with We Gadget BD for inquiries, orders, or support. Contact us via phone, email, or visit our office.",
    path: locale === "bn" ? "/bn/contact-us" : "/contact-us",
    keywords: ["contact We Gadget BD", "gadget shop dhaka", "customer support", "phone number", "office address"],
  });
}

export default async function ContactUsPage() {
  const t = await getTranslations("info.contact");

  const contactCards = [
    {
      icon: PhoneOutlinedIcon,
      title: t("phoneTitle"),
      primary: t("phonePrimary"),
      secondary: t("phoneSecondary"),
      href: "tel:+8801576641142",
      actionLabel: t("phoneAction"),
    },
    {
      icon: MailOutlinedIcon,
      title: t("emailTitle"),
      primary: t("emailPrimary"),
      secondary: t("emailSecondary"),
      href: "mailto:support@wegadgetbd.com",
      actionLabel: t("emailAction"),
    },
    {
      icon: PlaceOutlinedIcon,
      title: t("officeTitle"),
      primary: t("officePrimary"),
      secondary: t("officeSecondary"),
      href: "https://maps.google.com/?q=Dhanmondi+Dhaka",
      actionLabel: t("officeAction"),
    },
    {
      icon: AccessTimeOutlinedIcon,
      title: t("hoursTitle"),
      primary: t("hoursPrimary"),
      secondary: t("hoursSecondary"),
      href: undefined,
      actionLabel: undefined,
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: tokens.bgCanvas,
        minHeight: "100vh",
        py: { xs: 4, md: 7 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 680,
            mx: "auto",
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: tokens.primary,
              bgcolor: tokens.primaryLight,
              px: 2,
              py: 0.5,
              borderRadius: "9999px",
              mb: 1.5,
            }}
          >
            {t("badge")}
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: tokens.textPrimary,
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: tokens.textSecondary,
              lineHeight: 1.6,
            }}
          >
            {t("subtitle")}
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2.5,
            mb: { xs: 4, md: 6 },
          }}
        >
          {contactCards.map((item) => {
            const IconComponent = item.icon;
            const isClickable = Boolean(item.href);

            return (
              <Box
                key={item.title}
                component={isClickable ? "a" : "div"}
                href={item.href}
                target={item.href?.startsWith("http") ? "_blank" : undefined}
                rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  bgcolor: tokens.bgPanel,
                  border: "1px solid",
                  borderColor: tokens.borderDefault,
                  borderRadius: "16px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: tokens.primaryLight,
                    color: tokens.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <IconComponent sx={{ fontSize: 22 }} />
                </Box>

                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: tokens.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: tokens.textPrimary,
                    lineHeight: 1.35,
                    mb: 0.5,
                  }}
                >
                  {item.primary}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: tokens.textSecondary,
                    lineHeight: 1.4,
                    mt: "auto",
                    pt: 1,
                  }}
                >
                  {item.secondary}
                </Typography>

                {item.actionLabel && (
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: tokens.primary,
                      mt: 1.5,
                    }}
                  >
                    {item.actionLabel} →
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Map Section */}
        <Box
          sx={{
            bgcolor: tokens.bgPanel,
            border: "1px solid",
            borderColor: tokens.borderDefault,
            borderRadius: "16px",
            overflow: "hidden",
            mb: { xs: 4, md: 6 },
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid",
              borderColor: tokens.borderSubtle,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: tokens.textPrimary }}>
              {t("mapTitle")}
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
              {t("mapArea")}
            </Typography>
          </Box>

          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.890641050765!2d90.38933831543153!3d23.749099984589697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8bd47433d6f%3A0x3c21f5c22d50f0a!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1690000000000!5m2!1sen!2sbd"
            title="Office Location"
            allowFullScreen
            loading="lazy"
            sx={{
              width: "100%",
              height: { xs: 260, md: 360 },
              border: 0,
              display: "block",
            }}
          />
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 6 }}>
          <FAQ />
        </Box>
      </Container>
    </Box>
  );
}
