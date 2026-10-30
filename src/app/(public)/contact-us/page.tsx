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

export const metadata: Metadata = buildPublicMetadata({
  title: "যোগাযোগ করুন | We Gadget BD",
  description: "যেকোনো জিজ্ঞাসা, অর্ডার বা সাপোর্টের জন্য We Gadget BD-এর সাথে যোগাযোগ করুন। ফোন, ইমেইল বা সরাসরি আমাদের অফিসে আসতে পারেন।",
  path: "/contact-us",
  keywords: ["contact We Gadget BD", "gadget shop dhaka", "customer support", "phone number", "office address"],
});

const contactCards = [
  {
    icon: PhoneOutlinedIcon,
    title: "ফোন করুন",
    primary: "+880 1576-641142",
    secondary: "সরাসরি কথা বলতে কল করুন",
    href: "tel:+8801576641142",
    actionLabel: "কল করুন",
  },
  {
    icon: MailOutlinedIcon,
    title: "ইমেইল পাঠান",
    primary: "support@wegadgetbd.com",
    secondary: "যেকোনো প্রশ্ন বা ফিডব্যাকের জন্য",
    href: "mailto:support@wegadgetbd.com",
    actionLabel: "ইমেইল পাঠান",
  },
  {
    icon: PlaceOutlinedIcon,
    title: "অফিস ঠিকানা",
    primary: "লেভেল ৪, হাউস ১২, রোড ৭",
    secondary: "ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ",
    href: "https://maps.google.com/?q=Dhanmondi+Dhaka",
    actionLabel: "ম্যাপে দেখুন",
  },
  {
    icon: AccessTimeOutlinedIcon,
    title: "কাস্টমার সাপোর্ট সময়",
    primary: "সকাল ১০:০০ - রাত ৮:০০",
    secondary: "শনিবার থেকে বৃহস্পতিবার (শুক্রবার বন্ধ)",
    href: undefined,
    actionLabel: undefined,
  },
];

export default function ContactUsPage() {
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
            যোগাযোগ
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
            আমাদের সাথে যোগাযোগ করুন
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: tokens.textSecondary,
              lineHeight: 1.6,
            }}
          >
            আপনার যেকোনো প্রশ্ন, অর্ডার আপডেট বা পরামর্শের জন্য আমাদের টিম সবসময় প্রস্তুত। নিচের যেকোনো মাধ্যমে আমাদের সাথে যুক্ত হতে পারেন।
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
              আমাদের লোকেশন (Google Maps)
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
              ধানমন্ডি, ঢাকা
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
