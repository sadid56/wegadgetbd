import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BongoNex | Premium Gadgets Store",
    template: "%s | BongoNex",
  },
  description:
    "Shop 100% authentic gadgets, smartwatches, TWS earbuds, audio gear, and lifestyle tech accessories in Bangladesh. Official warranty, fast delivery & cash on delivery from BongoNex.",
  applicationName: "BongoNex",
  authors: [{ name: "BongoNex", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "BongoNex",
    "Bongo Nex",
    "online gadget shop Bangladesh",
    "authentic gadgets BD",
    "buy smart watch online BD",
    "TWS earbuds Bangladesh",
    "mobile accessories Dhaka",
    "lifestyle tech products",
    "cash on delivery gadgets bd",
    "best gadget store bd",
  ],
  referrer: "origin-when-cross-origin",
  creator: "BongoNex",
  publisher: "BongoNex",
  category: "technology",
  classification: "Ecommerce Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "bn-BD": siteUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "BongoNex",
    title: "BongoNex | Premium Gadgets Store",
    description:
      "Shop 100% authentic gadgets, smartwatches, TWS earbuds, audio gear, and lifestyle tech accessories with fast delivery and trusted support from BongoNex.",
    images: [
      {
        url: "/images/default.png",
        width: 1200,
        height: 630,
        alt: "BongoNex | Premium Gadgets Store in Bangladesh",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BongoNex | Premium Gadgets Store",
    description:
      "Shop 100% authentic gadgets, smartwatches, TWS earbuds, audio gear, and lifestyle tech accessories with fast delivery and trusted support from BongoNex.",
    site: "@bongonex",
    creator: "@bongonex",
    images: ["/images/default.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/logo.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
};

const rootJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "BongoNex",
      alternateName: ["Bongo Nex", "BongoNex Bangladesh", "BongoNex Online Shop"],
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: ["en-US", "bn-BD"],
    },
    {
      "@type": ["OnlineStore", "Organization"],
      "@id": `${siteUrl}/#organization`,
      name: "BongoNex",
      alternateName: "Bongo Nex",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        url: `${siteUrl}/logo.png`,
        caption: "BongoNex Logo",
      },
      image: `${siteUrl}/images/default.png`,
      description:
        "BongoNex is Bangladesh's premier online store for 100% authentic gadgets, smartwatches, TWS earbuds, and premium tech accessories with cash on delivery and nationwide fast shipping.",
      priceRange: "৳৳",
      currenciesAccepted: "BDT",
      paymentAccepted: "Cash, bKash, Nagad, Card",
      areaServed: {
        "@type": "Country",
        name: "Bangladesh",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Bengali", "English"],
          areaServed: "BD",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }} />
        <AppRouterCacheProvider>
          <AppProvider>{children}</AppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
