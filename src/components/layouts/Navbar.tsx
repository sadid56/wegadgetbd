"use client";

import NextLink from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Drawer from "@mui/material/Drawer";
import CircularProgress from "@mui/material/CircularProgress";
import { keyframes } from "@emotion/react";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LayersIcon from "@mui/icons-material/Layers";
import InfoIcon from "@mui/icons-material/Info";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/hooks/useCart";
import { IMAGES } from "@/constant/images";

const routes = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/products", label: "Products", icon: Inventory2Icon },
  { href: "/collection", label: "Collection", icon: LayersIcon },
  { href: "/about", label: "About", icon: InfoIcon },
  { href: "/cart", label: "Cart", icon: LocalMallIcon },
  { href: "/contact-us", label: "Contact", icon: MailIcon },
];

const BOTTOM_NAV = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/products", label: "Products", icon: Inventory2Icon },
  { href: "/cart", label: "Cart", icon: LocalMallIcon },
  { href: "/collection", label: "Picks", icon: LayersIcon },
  { href: "/contact-us", label: "More", icon: MenuIcon },
];

const MARQUEE = [
  { icon: LocalShippingIcon, text: "Free shipping on orders over ৳2,000" },
  { icon: ShieldIcon, text: "100% authentic products — guaranteed" },
  { icon: ShoppingCartIcon, text: "Cash on delivery available nationwide" },
  { icon: AutoAwesomeIcon, text: "New arrivals just dropped — shop now!" },
  { icon: LocalOfferIcon, text: "Exclusive deals every week for members" },
  { icon: PhoneIcon, text: "24/7 support  ·  +880 1576-641142" },
];

const PHONE = "+8801576641142";
const FONT = "'DM Sans','Outfit',system-ui,sans-serif";
const BENGALI_FONT = "'Hind Siliguri','Noto Sans Bengali',system-ui,sans-serif";

const HAS_VIDEO = false;
const YOUTUBE_VIDEO_ID = "LFzv0-QPpMw?si=F7LgiRQF6_IgbBR4";
const YOUTUBE_URL = "https://youtu.be/LFzv0-QPpMw?si=F7LgiRQF6_IgbBR4";
const YOUTUBE_EMBED = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}&autoplay=1&rel=0&modestbranding=1`;

const marqueeScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.88); }
  to { transform: scale(1); }
`;

const slideDown = keyframes`
  from { transform: translateY(-24px); }
  to { transform: translateY(0); }
`;

const popIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

// ─── LokkhoModal ───────────────────────────────────────────────
function LokkhoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const Section = ({
    pill,
    pillColor,
    children,
  }: {
    pill: string;
    pillColor: "green" | "blue" | "amber" | "purple";
    children: React.ReactNode;
  }) => {
    const colors = {
      green: { bg: "#dcfce7", text: "#15803d", dot: "#16a34a" },
      blue: { bg: "#dbeafe", text: "#1d4ed8", dot: "#2563eb" },
      amber: { bg: "#fef3c7", text: "#92400e", dot: "#d97706" },
      purple: { bg: "#ede9fe", text: "#6d28d9", dot: "#7c3aed" },
    } as const;
    const c = colors[pillColor];
    return (
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.7px",
              textTransform: "uppercase",
              px: 1.25,
              py: 0.4,
              borderRadius: 10,
              bgcolor: c.bg,
              color: c.text,
              fontFamily: FONT,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: c.dot,
              }}
            />
            {pill}
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "#f8fafc",
            border: "1px solid #f1f5f9",
            borderRadius: "14px",
            p: "16px 18px",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  };

  const Para = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <Typography
      component='p'
      sx={{
        fontSize: "14.5px",
        color: "#334155",
        lineHeight: 1.9,
        m: "0 0 10px",
        fontFamily: BENGALI_FONT,
      }}
      style={style}
    >
      {children}
    </Typography>
  );

  const Bold = ({ children }: { children: React.ReactNode }) => (
    <Box component='strong' sx={{ fontWeight: 700, color: "#0f172a" }}>
      {children}
    </Box>
  );
  const Green = ({ children }: { children: React.ReactNode }) => (
    <Box component='span' sx={{ color: "#059669", fontWeight: 700 }}>
      {children}
    </Box>
  );
  const Red = ({ children }: { children: React.ReactNode }) => (
    <Box component='span' sx={{ color: "#dc2626" }}>
      {children}
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open} timeout={220}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "calc(100% - 32px)",
            maxWidth: 640,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
            overflow: "hidden",
            borderRadius: "20px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 4px 20px rgba(0,0,0,0.1)",
            animation: `${scaleIn} 280ms cubic-bezier(0.34, 1.4, 0.64, 1)`,
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
              p: "20px 24px 16px",
              flexShrink: 0,
              display: "flex",
              alignItems: "flex-start",
              gap: 1.75,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "12px",
                background: "linear-gradient(135deg,#10b981,#059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box component='svg' width={20} height={20} fill='none' viewBox='0 0 24 24'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' fill='white' />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: BENGALI_FONT,
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#fff",
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                আমাদের লক্ষ্য ও দৃষ্টিভঙ্গি
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "#94a3b8",
                  fontWeight: 400,
                }}
              >
                BongoNex — কোয়ালিটি ও বিশ্বাসের প্রতিশ্রুতি
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size='small'
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "8px",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
                transition: "all 0.15s",
                "&:hover": {
                  bgcolor: "rgba(239,68,68,0.2)",
                  color: "#fca5a5",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ overflowY: "auto", flex: 1 }}>
            <Box
              sx={{
                background: "linear-gradient(135deg,#ecfdf5,#f0fdf4)",
                borderBottom: "1px solid #d1fae5",
                p: "18px 24px 16px",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "#10b981",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 10,
                  mb: 1.25,
                  letterSpacing: "0.5px",
                  fontFamily: FONT,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.7)",
                  }}
                />
                স্বাগতম
              </Box>
              <Typography
                sx={{
                  fontFamily: BENGALI_FONT,
                  fontSize: 15,
                  color: "#065f46",
                  lineHeight: 1.85,
                  fontWeight: 500,
                }}
              >
                আসসালামু আলাইকুম।{" "}
                <Box component='strong' sx={{ fontWeight: 700 }}>
                  আমাদের বঙ্গনেক্স পরিবার থেকে আপনাকে স্বাগতম।
                </Box>
              </Typography>
            </Box>

            <Box sx={{ p: "20px 24px 24px" }}>
              <Section pill='আমাদের মূল ফোকাস' pillColor='green'>
                <Para>
                  আমাদের মূল ফোকাস হলো <Bold>কোয়ালিটি এবং ট্রাস্ট।</Bold>
                </Para>
                <Para>
                  এই লক্ষ্যেই আমরা সবসময় প্রোডাক্টের গুণমানের ওপর সর্বোচ্চ গুরুত্ব দিয়ে থাকি। আমাদের কাছে লো, মিডিয়াম এবং হাই কোয়ালিটির
                  প্রোডাক্টের সোর্স থাকলেও আমরা সচেতনভাবে শুধুমাত্র <Green>মিডিয়াম এবং হাই কোয়ালিটির প্রোডাক্টই</Green> সিলেক্ট করে
                  আপনাদের কাছে পৌঁছে দিই।
                </Para>
                <Para style={{ margin: 0 }}>
                  আমাদের প্রতিটি প্রোডাক্ট <Bold>চায়না, জাপান, পাকিস্তানসহ বিভিন্ন আন্তর্জাতিক সোর্স</Bold> থেকে আনা হয়।
                </Para>
              </Section>

              <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />

              <Section pill='আমাদের ব্যবসায়িক দর্শন' pillColor='blue'>
                <Para>
                  যখন আপনি আমাদের প্রোডাক্ট ব্যবহার করে উপকৃত হবেন, তখনই আবার আমাদের কাছ থেকে কিনতে আসবেন — এমনকি আপনার ফ্রেন্ড সার্কেলেও
                  আমাদের সাজেস্ট করবেন।
                </Para>
                <Para>
                  বিজনেসের ভাষায় একে বলা হয় <Bold>রিপিট সেল বা রিসেলিং।</Bold> কারণ সত্যি কথা বলতে, একবার প্রোডাক্ট সেল করে কখনো বড় কিছু
                  হতে পারব না।
                </Para>
                <Para style={{ margin: 0 }}>
                  <Green>আমাদের টার্গেট হলো আপনার সাথে দীর্ঘমেয়াদী সম্পর্ক তৈরি করা।</Green> আর আপনার কাছে বারবার সেল করতে হলে অবশ্যই
                  আপনাকে ভালো প্রোডাক্ট দিতে হবে।
                </Para>
              </Section>

              <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />

              <Section pill='আমরা কেন লো কোয়ালিটি দিই না' pillColor='amber'>
                <Para>
                  যদি বেশি লাভের আশায় লো কোয়ালিটির প্রোডাক্ট বিক্রি করি, তাহলে হয়তো একবার সেল হবে — কিন্তু তাতে আপনার{" "}
                  <Red>টাকা নষ্ট হবে</Red> এবং আপনি মনে মনে ভাববেন:
                </Para>
                <Box
                  sx={{
                    bgcolor: "#fffbeb",
                    borderLeft: "3px solid #f59e0b",
                    borderRadius: "0 10px 10px 0",
                    p: "12px 16px",
                    my: "2px 0 12px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: BENGALI_FONT,
                      fontSize: 14,
                      color: "#78350f",
                      lineHeight: 1.85,
                      fontStyle: "italic",
                    }}
                  >
                    "অনলাইনে জিনিস মানেই খারাপ।"
                    <br />
                    "লোকটা আমার টাকা মেরে খেলো।"
                  </Typography>
                </Box>
                <Para style={{ margin: 0 }}>
                  <Bold>এই ধরনের কষ্ট বা দীর্ঘশ্বাসের কারণ হতে আমরা চাই না।</Bold> এই বিষয়গুলো মাথায় রেখেই আমরা সবসময় মিডিয়াম এবং হাই
                  কোয়ালিটির প্রোডাক্টই সিলেক্ট করি।
                </Para>
              </Section>

              <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />

              <Section pill='দামে নয়, কোয়ালিটিতে ফোকাস' pillColor='purple'>
                <Para>
                  আমরা বিশ্বাস করি,{" "}
                  <Bold>
                    ৫০ টাকা কম দামে খারাপ প্রোডাক্ট দেওয়ার চেয়ে একটু বেশি দামে ভালো কোয়ালিটির প্রোডাক্ট দেওয়া অনেক বেশি গুরুত্বপূর্ণ।
                  </Bold>
                </Para>
                <Para>
                  আমরা শুধু প্রোডাক্ট সেল করি না — <Green>আমরা আপনার সমস্যার সমাধান দেওয়ার চেষ্টা করি।</Green>
                </Para>
                <Para style={{ margin: 0 }}>
                  অর্ডার করার আগে চাইলে <Bold>WhatsApp বা কলে আমাদের সাথে যোগাযোগ করুন,</Bold> প্রোডাক্ট সম্পর্কে বিস্তারিত জেনে নিন, তারপর
                  অর্ডার কনফার্ম করুন।
                </Para>
              </Section>

              <Box
                sx={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  borderRadius: "14px",
                  p: "20px 22px",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: BENGALI_FONT,
                    fontSize: 15,
                    color: "#e2e8f0",
                    lineHeight: 1.9,
                  }}
                >
                  আমাদের লক্ষ্য একটাই —<br />
                  <Box component='span' sx={{ color: "#34d399", fontWeight: 700 }}>
                    আপনি যেন প্রোডাক্ট ব্যবহার করে সন্তুষ্ট হন।
                  </Box>
                  <br />
                  <Box component='span' sx={{ color: "#94a3b8", fontSize: "13.5px" }}>
                    আপনি জিতলেই আমরা জিতবো।
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: "14px 24px",
              bgcolor: "#f8fafc",
              borderTop: "1px solid #f1f5f9",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontFamily: FONT, fontSize: "11.5px", color: "#94a3b8" }}>BongoNex — Trusted Store ✦</Typography>
            <Button
              onClick={onClose}
              disableElevation
              sx={{
                bgcolor: "#10b981",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                px: 2.25,
                py: 1,
                borderRadius: "10px",
                fontFamily: BENGALI_FONT,
                textTransform: "none",
                "&:hover": { bgcolor: "#059669" },
              }}
            >
              ধন্যবাদ ✓
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

// ─── VideoModal ───────────────────────────────────────────────
function VideoModal({ open, onClose, onOpenLokkho }: { open: boolean; onClose: () => void; onOpenLokkho: () => void }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!open) setKey((k) => k + 1);
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open} timeout={220}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "calc(100% - 32px)",
            maxWidth: 768,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            animation: `${scaleIn} 280ms cubic-bezier(0.34, 1.4, 0.64, 1)`,
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: { xs: 1, md: 1.75 },
              bgcolor: "#0f172a",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 14, color: "#fff", ml: "2px" }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 14,
                    lineHeight: 1.2,
                    color: "#fff",
                  }}
                >
                  আমাদের গল্প
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 500,
                    fontSize: 11,
                    color: "#64748b",
                    mt: 0.25,
                  }}
                >
                  BongoNex — আমাদের গল্প ও দৃষ্টিভঙ্গি
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                component='a'
                href={YOUTUBE_URL}
                target='_blank'
                rel='noopener noreferrer'
                startIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                disableElevation
                sx={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94a3b8",
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  px: 1.5,
                  py: 0.75,
                  textTransform: "none",
                  minWidth: 0,
                  "&:hover": {
                    bgcolor: "rgba(239,68,68,0.15)",
                    color: "#fca5a5",
                    borderColor: "rgba(239,68,68,0.3)",
                  },
                }}
              >
                YouTube
              </Button>
              <IconButton
                onClick={onClose}
                size='small'
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "12px",
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748b",
                  "&:hover": {
                    bgcolor: "rgba(239,68,68,0.15)",
                    color: "#fca5a5",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Video */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pb: "56.25%",
              bgcolor: "#000",
            }}
          >
            <Box
              component='iframe'
              key={key}
              src={open ? YOUTUBE_EMBED : ""}
              title='আমাদের গল্প — BongoNex'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 1.5,
              bgcolor: "#0f172a",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Button
              onClick={() => {
                onClose();
                setTimeout(onOpenLokkho, 200);
              }}
              endIcon={<ChevronRightIcon sx={{ fontSize: 12 }} />}
              disableElevation
              sx={{
                fontFamily: FONT,
                fontSize: "11.5px",
                fontWeight: 700,
                bgcolor: "#10b981",
                color: "#fff",
                borderRadius: "12px",
                px: 1.75,
                py: 0.75,
                textTransform: "none",
                minWidth: 0,
                "&:hover": { bgcolor: "#059669" },
              }}
            >
              See All
            </Button>
            <Button
              component={NextLink}
              href='/about'
              onClick={onClose}
              endIcon={<ChevronRightIcon sx={{ fontSize: 12 }} />}
              disableElevation
              sx={{
                fontFamily: FONT,
                fontSize: "11.5px",
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                px: 1.75,
                py: 0.75,
                textTransform: "none",
                minWidth: 0,
                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
              }}
            >
              About us
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

// ─── Navbar ────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [lokkhoOpen, setLokkhoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [avatarAnchor, setAvatarAnchor] = useState<HTMLElement | null>(null);

  const { data: sessionData, isPending } = useSession();
  const { totalCount } = useCart();

  const session = sessionData?.user ?? null;
  const userName = session?.name || "";
  const userEmail = session?.email || "";
  const userImage = session?.image || "";
  const userRole = (session as any)?.role || "";
  const userInitial = userName.charAt(0).toUpperCase() || "U";

  useEffect(() => setMounted(true), []);

  const isProductsPage = pathname === "/products" || pathname.startsWith("/products/");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 80);
      }
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMenuOpen(false);
      setSearchOpen(false);
    });
  }, [pathname]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("search");
    if (q) {
      router.push(`/products?search=${q}`);
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    setAvatarAnchor(null);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  const marqueeItems = [...MARQUEE, ...MARQUEE];

  const navLinkSx = {
    position: "relative",
    px: 2,
    py: 1,
    borderRadius: "8px",
    fontSize: "13.5px",
    fontWeight: 600,
    fontFamily: FONT,
    textDecoration: "none",
    transition: "color 150ms, background-color 150ms",
  } as const;

  return (
    <>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} onOpenLokkho={() => setLokkhoOpen(true)} />
      <LokkhoModal open={lokkhoOpen} onClose={() => setLokkhoOpen(false)} />

      {/* ═══ MARQUEE ═══ */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          overflow: "hidden",
          userSelect: "none",
          bgcolor: "#0a0f1a",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            py: "7px",
            "&::before": {
              content: '""',
              pointerEvents: "none",
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 96,
              zIndex: 10,
              background: "linear-gradient(90deg,#0a0f1a,transparent)",
            },
            "&::after": {
              content: '""',
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 96,
              zIndex: 10,
              background: "linear-gradient(270deg,#0a0f1a,transparent)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "max-content",
              animation: `${marqueeScroll} 42s linear infinite`,
              "&:hover": { animationPlayState: "paused" },
            }}
          >
            {marqueeItems.map(({ icon: Icon, text }, i) => (
              <Box
                key={i}
                component='span'
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  whiteSpace: "nowrap",
                  px: 4,
                  fontFamily: FONT,
                  fontSize: "11.5px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  letterSpacing: "0.01em",
                }}
              >
                <Icon sx={{ fontSize: 12, color: "#34d399", flexShrink: 0 }} />
                {text}
                <Box component='span' sx={{ mx: 1.5, opacity: 0.2, fontSize: 18, lineHeight: 1 }}>
                  ·
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ═══ HEADER ═══ */}
      <Box
        component='header'
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          fontFamily: FONT,
          bgcolor: "#fff",
          borderBottom: "1px solid #f1f5f9",
          boxShadow: scrolled
            ? "0 1px 0 #e2e8f0, 0 6px 32px -4px rgba(0,0,0,0.11), 0 2px 10px -2px rgba(0,0,0,0.07)"
            : "0 1px 0 #f1f5f9, 0 2px 12px -4px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.35s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            px: { xs: 2, md: 3 },
            borderBottom: "1px solid #a7f3d0",
            boxShadow: "0 1px 2px rgba(110,231,183,0.3)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: { xs: 62, md: 70 },
              gap: { xs: 1.5, md: 2.5 },
            }}
          >
            {/* Logo */}
            <Box
              component={NextLink}
              href='/'
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
                textDecoration: "none",
                "&:hover .logo-img": { transform: "scale(1.1)" },
              }}
            >
              <Box
                className='logo-img'
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  width: 58,
                  height: 58,
                  transition: "transform 300ms",
                }}
              >
                <Box component='img' src='/logo.png' alt='BongoNex' sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  lineHeight: 1,
                  gap: 0.5,
                }}
              >
                <Box
                  component='span'
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 16,
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  BongoNex
                </Box>
                <Box
                  component='span'
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 7,
                    color: "#10b981",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  ✦ Trusted Store
                </Box>
              </Box>
            </Box>

            <Divider
              orientation='vertical'
              flexItem
              sx={{
                display: { xs: "none", lg: "block" },
                height: 28,
                mx: 0.5,
                borderColor: "#f3f4f6",
              }}
            />

            {/* Desktop nav */}
            <Box component='nav' sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: "2px" }}>
              {routes.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <Box
                    key={href}
                    component={NextLink}
                    href={href}
                    sx={{
                      ...navLinkSx,
                      color: active ? "#0f172a" : "#64748b",
                      bgcolor: active ? "#f8fafc" : "transparent",
                      "&:hover": {
                        color: "#0f172a",
                        bgcolor: active ? "#f8fafc" : "#f8fafc",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 6,
                        left: 16,
                        right: 16,
                        height: 2,
                        borderRadius: 999,
                        bgcolor: "#10b981",
                        transform: active ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "center",
                        transition: "transform 200ms ease",
                      },
                    }}
                  >
                    <Box component='span' sx={{ position: "relative", zIndex: 1 }}>
                      {label}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Right side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
              {/* আমাদের-লক্ষ্য button */}
              <Box
                component='button'
                type='button'
                onClick={() => (HAS_VIDEO ? setVideoOpen(true) : setLokkhoOpen(true))}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "6px",
                  border: "1px solid transparent",
                  color: "#b91c1c",
                  fontFamily: FONT,
                  height: 34,
                  pl: 1.25,
                  pr: 1.5,
                  bgcolor: "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 1px 4px rgba(251,191,36,0.20)",
                  transition: "transform 200ms, border-color 200ms",
                  "&:hover": { transform: "scale(1.04)", borderColor: "#fbbf24" },
                  "&:active": { transform: "scale(0.96)" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    bgcolor: "#ef4444",
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 10, color: "#fff", ml: "1px" }} />
                </Box>
                <Box
                  component='span'
                  sx={{
                    color: "#6b7280",
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.01em",
                  }}
                >
                  আমাদের-লক্ষ্য
                </Box>
              </Box>

              {/* Search trigger */}
              <Box
                component='button'
                type='button'
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchRef.current?.focus(), 80);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  height: 36,
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  pl: 1.5,
                  pr: 1.25,
                  minWidth: 36,
                  cursor: "pointer",
                  fontFamily: FONT,
                  transition: "background-color 200ms, border-color 200ms",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                }}
              >
                <SearchIcon sx={{ fontSize: 15, color: "#94a3b8", flexShrink: 0 }} />
                <Box
                  component='span'
                  sx={{
                    display: { xs: "none", md: "block" },
                    fontSize: "12.5px",
                    fontWeight: 500,
                    color: "#94a3b8",
                  }}
                >
                  Search products...
                </Box>
                <Box
                  component='span'
                  sx={{
                    display: { xs: "none", lg: "flex" },
                    alignItems: "center",
                    ml: 1,
                    fontSize: 10,
                    fontFamily: "monospace",
                    borderRadius: "4px",
                    px: 0.75,
                    py: 0.25,
                    color: "#94a3b8",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    lineHeight: 1,
                  }}
                >
                  ⌘K
                </Box>
              </Box>

              {/* Cart */}
              <Box
                component={NextLink}
                href='/cart'
                sx={{
                  position: "relative",
                  height: 36,
                  width: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  textDecoration: "none",
                  transition: "background-color 200ms, border-color 200ms",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 15, color: "#475569" }} />
                {mounted && totalCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 900,
                      bgcolor: "#10b981",
                      outline: "2px solid #fff",
                      borderRadius: 999,
                      height: 18,
                      minWidth: 18,
                      fontSize: 9,
                      px: 0.5,
                      animation: `${popIn} 200ms ease`,
                    }}
                  >
                    {totalCount > 9 ? "9+" : totalCount}
                  </Box>
                )}
              </Box>

              {/* Auth */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {!mounted || isPending ? (
                  <Box sx={{ height: 36, width: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={16} sx={{ color: "#cbd5e1" }} />
                  </Box>
                ) : session ? (
                  <>
                    <IconButton
                      onClick={(e) => setAvatarAnchor(e.currentTarget)}
                      sx={{
                        p: 0,
                        width: 36,
                        height: 36,
                        borderRadius: "12px",
                        overflow: "hidden",
                        outline: "2px solid #e2e8f0",
                        transition: "outline-color 200ms",
                        "&:hover": { outlineColor: "#6ee7b7" },
                      }}
                    >
                      <Avatar
                        src={userImage || IMAGES?.default_avatar}
                        alt={userName}
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: "#ecfdf5",
                          color: "#065f46",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {userInitial}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={avatarAnchor}
                      open={Boolean(avatarAnchor)}
                      onClose={() => setAvatarAnchor(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      slotProps={{
                        paper: {
                          sx: {
                            width: 256,
                            mt: 1,
                            borderRadius: "18px",
                            border: "1px solid #f1f5f9",
                            boxShadow: "0 20px 60px -8px rgba(0,0,0,0.16), 0 4px 20px -4px rgba(0,0,0,0.08)",
                            fontFamily: FONT,
                            overflow: "hidden",
                          },
                        },
                      }}
                    >
                      <Box sx={{ p: 2, background: "linear-gradient(135deg,#f0fdf4,#f8fafc)" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            src={userImage || IMAGES?.default_avatar}
                            alt={userName}
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: "#ecfdf5",
                              color: "#065f46",
                              fontWeight: 700,
                              fontSize: 14,
                              outline: "2px solid #fff",
                              outlineOffset: 1,
                              boxShadow: "0 0 0 3.5px #d1fae5",
                            }}
                          >
                            {userInitial}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#0f172a",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {userName}
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.25,
                                fontSize: 11,
                                color: "#94a3b8",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider sx={{ borderColor: "#f1f5f9" }} />
                      {userRole === "ADMIN" && (
                        <>
                          <Box sx={{ p: 0.75 }}>
                            <MenuItem component={NextLink} href='/admin' onClick={() => setAvatarAnchor(null)} sx={menuItemSx}>
                              <Box sx={menuIconWrapSx("#eff6ff")}>
                                <DashboardIcon sx={{ fontSize: 14, color: "#3b82f6" }} />
                              </Box>
                              Admin Dashboard
                            </MenuItem>
                            <MenuItem component={NextLink} href='/admin/settings' onClick={() => setAvatarAnchor(null)} sx={menuItemSx}>
                              <Box sx={menuIconWrapSx("#faf5ff")}>
                                <SettingsIcon sx={{ fontSize: 14, color: "#8b5cf6" }} />
                              </Box>
                              Settings
                            </MenuItem>
                          </Box>
                          <Divider sx={{ borderColor: "#f1f5f9" }} />
                        </>
                      )}
                      <Box sx={{ p: 0.75 }}>
                        <MenuItem onClick={handleSignOut} sx={{ ...menuItemSx, color: "#ef4444" }}>
                          <Box sx={menuIconWrapSx("#fef2f2")}>
                            <LogoutIcon sx={{ fontSize: 14, color: "#ef4444" }} />
                          </Box>
                          Sign Out
                        </MenuItem>
                      </Box>
                    </Menu>
                  </>
                ) : (
                  <Button
                    component={NextLink}
                    href='/auth/sign-in'
                    disableElevation
                    sx={{
                      height: 36,
                      px: 2.5,
                      borderRadius: "8px",
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: FONT,
                      fontSize: 13,
                      bgcolor: "#0f172a",
                      textTransform: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
                      "&:hover": { bgcolor: "#1e293b" },
                      "&:active": { transform: "scale(0.96)" },
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>

              {/* Hamburger */}
              <IconButton
                onClick={() => setMenuOpen((v) => !v)}
                aria-label='Open navigation'
                sx={{
                  display: { xs: "inline-flex", lg: "none" },
                  height: 36,
                  width: 36,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  transition: "background-color 200ms, border-color 200ms",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 150ms",
                    color: "#374151",
                  }}
                >
                  {menuOpen ? <CloseIcon sx={{ fontSize: 16 }} /> : <MenuIcon sx={{ fontSize: 16 }} />}
                </Box>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ═══ SEARCH OVERLAY ═══ */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} closeAfterTransition>
        <Fade in={searchOpen} timeout={220}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bgcolor: "#fff",
              boxShadow: "0 8px 40px -8px rgba(0,0,0,0.18)",
              fontFamily: FONT,
              animation: `${slideDown} 280ms ease`,
              outline: "none",
            }}
          >
            <Box sx={{ maxWidth: 672, mx: "auto", px: 2, py: 2.5 }}>
              <Box component='form' onSubmit={handleSearch} sx={{ position: "relative" }}>
                <SearchIcon
                  sx={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 15,
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
                <InputBase
                  inputRef={searchRef}
                  name='search'
                  autoFocus
                  placeholder='Search products, categories, brands...'
                  sx={{
                    width: "100%",
                    pl: "44px",
                    pr: "48px",
                    height: 48,
                    borderRadius: "12px",
                    fontSize: 15,
                    fontFamily: FONT,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    transition: "border-color 200ms",
                    "& input::placeholder": { color: "#cbd5e1", opacity: 1 },
                    "&.Mui-focused": { borderColor: "#94a3b8" },
                    "&.Mui-focused fieldset": { border: "none" },
                  }}
                />
                <IconButton
                  onClick={() => setSearchOpen(false)}
                  size='small'
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: "#f1f5f9",
                    color: "#94a3b8",
                    "&:hover": { bgcolor: "#e2e8f0" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  textAlign: "center",
                  mt: 1.5,
                  fontSize: 12,
                  color: "#94a3b8",
                  fontFamily: FONT,
                }}
              >
                Press{" "}
                <Box
                  component='kbd'
                  sx={{
                    px: "6px",
                    py: "2px",
                    borderRadius: "5px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "#64748b",
                  }}
                >
                  ESC
                </Box>{" "}
                to close
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* ═══ BOTTOM NAV (mobile) ═══ */}
      {!isProductsPage && (
        <Box
          component='nav'
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            bgcolor: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid #f1f5f9",
            boxShadow: "0 -4px 20px -4px rgba(0,0,0,0.07)",
            fontFamily: FONT,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              px: 1,
              pt: 1,
              pb: 1.5,
            }}
          >
            {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
              const isMore = href === "/contact-us";
              const active = isMore ? menuOpen : pathname === href || (href !== "/" && pathname.startsWith(href));

              if (isMore) {
                return (
                  <Box
                    key='more'
                    component='button'
                    onClick={() => setMenuOpen((v) => !v)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.25,
                      minWidth: 52,
                      bgcolor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: FONT,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: menuOpen ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 150ms",
                        }}
                      >
                        {menuOpen ? <CloseIcon sx={{ fontSize: 20 }} /> : <MenuIcon sx={{ fontSize: 20 }} />}
                      </Box>
                    </Box>
                    <Box
                      component='span'
                      sx={{
                        fontSize: "9.5px",
                        fontWeight: 700,
                        color: menuOpen ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {label}
                    </Box>
                  </Box>
                );
              }

              return (
                <Box
                  key={href}
                  component={NextLink}
                  href={href}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.5,
                    py: 0.25,
                    minWidth: 52,
                    borderRadius: "12px",
                    textDecoration: "none",
                    transition: "background-color 200ms",
                    bgcolor: active ? "#f0fdf4" : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      color: active ? "#10b981" : "#94a3b8",
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                    {href === "/cart" && mounted && totalCount > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 900,
                          bgcolor: "#10b981",
                          outline: "2px solid #fff",
                          borderRadius: 999,
                          height: 16,
                          minWidth: 16,
                          fontSize: 9,
                          px: 0.4,
                        }}
                      >
                        {totalCount > 9 ? "9+" : totalCount}
                      </Box>
                    )}
                  </Box>
                  <Box
                    component='span'
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      fontSize: "9.5px",
                      fontWeight: 700,
                      color: active ? "#10b981" : "#94a3b8",
                    }}
                  >
                    {label}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ═══ DRAWER ═══ */}
      <Drawer
        anchor='right'
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              maxWidth: "88vw",
              boxShadow: "-8px 0 48px -8px rgba(0,0,0,0.18)",
              fontFamily: FONT,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Box
            component={NextLink}
            href='/'
            onClick={() => setMenuOpen(false)}
            sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none" }}
          >
            <Box
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                width: 38,
                height: 38,
                boxShadow: "0 0 0 1.5px #e2e8f0, 0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <Box component='img' src='/logo.png' alt='BongoNex' sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 0.5 }}>
              <Box
                component='span'
                sx={{
                  fontWeight: 900,
                  fontSize: 16,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                BongoNex
              </Box>
              <Box
                component='span'
                sx={{
                  fontWeight: 700,
                  fontSize: 9,
                  color: "#10b981",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                }}
              >
                ✦ Trusted Store
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={() => setMenuOpen(false)}
            size='small'
            sx={{
              width: 32,
              height: 32,
              borderRadius: "12px",
              bgcolor: "#f8fafc",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: "#64748b" }} />
          </IconButton>
        </Box>

        {/* Drawer nav */}
        <Box component='nav' sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1.5 }}>
          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 800,
              color: "#94a3b8",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              pl: 1.5,
              mb: 1.25,
            }}
          >
            Navigation
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {routes.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Box
                  key={href}
                  component={NextLink}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "13.5px",
                    textDecoration: "none",
                    bgcolor: active ? "#0f172a" : "transparent",
                    color: active ? "#fff" : "#374151",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: active ? "#0f172a" : "#f8fafc" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      bgcolor: active ? "rgba(255,255,255,0.15)" : "#f1f5f9",
                    }}
                  >
                    <Icon sx={{ fontSize: 14 }} />
                  </Box>
                  <Box component='span' sx={{ flex: 1 }}>
                    {label}
                  </Box>
                  {href === "/cart" && totalCount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        fontWeight: 900,
                        height: 20,
                        minWidth: 20,
                        px: 0.75,
                        fontSize: 10,
                        bgcolor: active ? "rgba(255,255,255,0.2)" : "#10b981",
                        color: "#fff",
                      }}
                    >
                      {totalCount}
                    </Box>
                  )}
                  {active && <ChevronRightIcon sx={{ fontSize: 14, opacity: 0.4 }} />}
                </Box>
              );
            })}

            {session && userRole === "ADMIN" && (
              <>
                <Divider sx={{ my: 1.25, borderColor: "#f1f5f9" }} />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#94a3b8",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    pl: 1.5,
                    mb: 1,
                  }}
                >
                  Admin
                </Typography>
                <Box component={NextLink} href='/admin' onClick={() => setMenuOpen(false)} sx={drawerAdminLinkSx("#2563eb", "#eff6ff")}>
                  <Box sx={menuIconWrapSx("#eff6ff")}>
                    <DashboardIcon sx={{ fontSize: 14, color: "#3b82f6" }} />
                  </Box>
                  Admin Dashboard
                </Box>
                <Box
                  component={NextLink}
                  href='/admin/settings'
                  onClick={() => setMenuOpen(false)}
                  sx={drawerAdminLinkSx("#7c3aed", "#faf5ff")}
                >
                  <Box sx={menuIconWrapSx("#faf5ff")}>
                    <SettingsIcon sx={{ fontSize: 14, color: "#8b5cf6" }} />
                  </Box>
                  Settings
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Drawer footer */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, borderTop: "1px solid #f1f5f9" }}>
          {session ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.5,
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}
            >
              <Avatar
                src={userImage || IMAGES?.default_avatar}
                alt={userName}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#ecfdf5",
                  color: "#065f46",
                  fontWeight: 700,
                  fontSize: 12,
                  boxShadow: "0 0 0 2px #fff, 0 0 0 3px #d1fae5",
                }}
              >
                {userInitial}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#94a3b8",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userEmail}
                </Typography>
              </Box>
              <IconButton
                onClick={handleSignOut}
                title='Sign out'
                size='small'
                sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } }}
              >
                <LogoutIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ) : (
            <Button
              component={NextLink}
              href='/auth/sign-in'
              onClick={() => setMenuOpen(false)}
              startIcon={<PersonIcon sx={{ fontSize: 15 }} />}
              disableElevation
              fullWidth
              sx={{
                height: 44,
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 700,
                fontFamily: FONT,
                fontSize: 14,
                bgcolor: "#0f172a",
                textTransform: "none",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#1e293b" },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              Sign In
            </Button>
          )}
          <Box
            component='a'
            href={`tel:${PHONE}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: "12px",
              bgcolor: "#f8fafc",
              border: "1px solid #f1f5f9",
              textDecoration: "none",
              transition: "background-color 200ms",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                flexShrink: 0,
                width: 30,
                height: 30,
                bgcolor: "#ecfdf5",
              }}
            >
              <PhoneIcon sx={{ fontSize: 14, color: "#10b981" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "9.5px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Call us
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{PHONE}</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

const menuItemSx = {
  display: "flex",
  alignItems: "center",
  py: 1.25,
  px: 1.5,
  borderRadius: "12px",
  fontFamily: FONT,
  fontSize: "13.5px",
  fontWeight: 600,
  color: "#374151",
  textDecoration: "none",
  "&:hover": { bgcolor: "#f8fafc" },
} as const;

const menuIconWrapSx = (bg: string) => ({
  width: 28,
  height: 28,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mr: 1.5,
  flexShrink: 0,
  bgcolor: bg,
});

const drawerAdminLinkSx = (color: string, hoverBg: string) =>
  ({
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    px: 1.5,
    py: 1.25,
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "13.5px",
    textDecoration: "none",
    color,
    transition: "background-color 200ms",
    "&:hover": { bgcolor: hoverBg },
  }) as const;
