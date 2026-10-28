"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Facebook, Instagram, YoutubeIcon } from "@/components/icons/social";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";

type SocialIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

const socialLinks: { name: string; href: string; icon: SocialIcon }[] = [
  { name: "Facebook", href: "https://www.facebook.com/BongoNexbd", icon: Facebook },
  { name: "Youtube", href: "https://www.youtube.com/@BongoNexbd", icon: YoutubeIcon },
  { name: "Instagram", href: "https://www.instagram.com/yourprofile", icon: Instagram },
];

const navigationGroups = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Collections", href: "/collection" },
    { label: "Shopping Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Top Selling", href: "/top-selling" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const linkSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  fontSize: 14,
  color: "#aaaaaa",
  textDecoration: "none",
  width: "fit-content",
  transition: "color 200ms",
  "&:hover": { color: "#ff7319" },
  "&:hover .footer-bullet": { borderColor: "#ff7319" },
} as const;

const sectionTitleSx = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#ffffff",
} as const;

function FooterLinkGroup({ items }: { items: { label: string; href: string }[] }) {
  return (
    <Box component='nav' sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {items.map((item) => (
        <Box key={item.href} component={NextLink} href={item.href} sx={linkSx}>
          <Box
            className='footer-bullet'
            component='span'
            sx={{
              display: "inline-block",
              width: 6,
              height: 6,
              flexShrink: 0,
              borderTop: "1px solid #777777",
              borderRight: "1px solid #777777",
              transform: "rotate(45deg)",
              transition: "border-color 200ms",
            }}
          />
          {item.label}
        </Box>
      ))}
    </Box>
  );
}

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/checkout")) return null;
  if (pathname?.startsWith("/products")) return null;

  const contactItems = [
    { Icon: PlaceOutlinedIcon, text: "Dhaka, Bangladesh", href: null as string | null },
    { Icon: PhoneOutlinedIcon, text: "+8801576641142", href: "tel:+8801576641142" },
    { Icon: MailOutlinedIcon, text: "support@bongonex.com", href: "mailto:support@bongonex.com" },
  ];

  return (
    <Box component='footer' sx={{ fontFamily: "system-ui, sans-serif", pb: { xs: 10, md: 0 } }}>
      <Box sx={{ bgcolor: "#2d2d2d" }}>
        <Container maxWidth={false} sx={{ px: { xs: 3, lg: 8 }, pt: 6, pb: 4, maxWidth: 1400, mx: "auto" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(12, 1fr)" },
              gap: 5,
              mb: 5,
            }}
          >
            {/* Brand */}
            <Box sx={{ gridColumn: { lg: "span 4" }, display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box
                component={NextLink}
                href='/'
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                  textDecoration: "none",
                }}
              >
                <Box sx={{ width: 80, height: 80, overflow: "hidden" }}>
                  <Box component='img' src='/logo.png' alt='BongoNex logo' sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#aaaaaa",
                  maxWidth: 320,
                }}
              >
                Discover cutting-edge gadgets and components designed to power the future. Innovation meets quality at BONGO NEX.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <Box
                    key={name}
                    component={NextLink}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={name}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#3a3a3a",
                      color: "#cccccc",
                      transition: "background-color 200ms",
                      textDecoration: "none",
                      "&:hover": { bgcolor: "#ff7319" },
                    }}
                  >
                    <Icon className='w-4 h-4' />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Shop */}
            <Box sx={{ gridColumn: { lg: "span 4" }, display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography component='h3' sx={sectionTitleSx}>
                Shop
              </Typography>
              <FooterLinkGroup items={navigationGroups.shop} />
            </Box>

            {/* Company + Legal */}
            <Box sx={{ gridColumn: { lg: "span 4" }, display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography component='h3' sx={sectionTitleSx}>
                Company
              </Typography>
              <FooterLinkGroup items={navigationGroups.company} />

              <Typography component='h3' sx={{ ...sectionTitleSx, pt: 2 }}>
                Legal
              </Typography>
              <FooterLinkGroup items={navigationGroups.legal} />
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#3d3d3d" }} />

          <Box
            sx={{
              pt: 3,
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { md: "center" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {contactItems.map(({ Icon, text, href }) => {
                const inner = (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Icon sx={{ fontSize: 14, color: "#ff7319", flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12, color: "#aaaaaa" }}>{text}</Typography>
                  </Box>
                );
                return href ? (
                  <Box
                    key={text}
                    component='a'
                    href={href}
                    sx={{
                      textDecoration: "none",
                      transition: "opacity 200ms",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    {inner}
                  </Box>
                ) : (
                  <Box key={text}>{inner}</Box>
                );
              })}
            </Box>

            <Typography sx={{ fontSize: 12, color: "#888888" }}>
              © {currentYear}{" "}
              <Box component='span' sx={{ fontWeight: { md: 700 }, color: "#ffffff" }}>
                BONGO NEX
              </Box>
              . All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
