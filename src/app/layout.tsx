import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { getSiteUrl } from "@/lib/seo";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#08120e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "We Gadget BD | Smarter Tech • Brighter Days",
    template: "%s | We Gadget BD",
  },
  description:
    "Shop 100% authentic gadgets, smartwatches, TWS earbuds, audio gear, and lifestyle tech accessories in Bangladesh. Official warranty, fast delivery & cash on delivery from We Gadget BD.",
  applicationName: "We Gadget BD",
  authors: [{ name: "We Gadget BD", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "We Gadget BD",
    "WeGadgetBD",
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
  creator: "We Gadget BD",
  publisher: "We Gadget BD",
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
    siteName: "We Gadget BD",
    title: "We Gadget BD | Smarter Tech • Brighter Days",
    description:
      "Shop 100% authentic gadgets, smartwatches, TWS earbuds, audio gear, and lifestyle tech accessories with fast delivery and trusted support from We Gadget BD.",
    images: [
      {
        url: "/images/default.png",
        width: 1200,
        height: 630,
        alt: "We Gadget BD | Smarter Tech • Brighter Days",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Gadget BD | Smarter Tech • Brighter Days",
    description:
      "Shop 100% authentic gadgets, smartwatches, TWS earbuds, audio gear, and lifestyle tech accessories with fast delivery and trusted support from We Gadget BD.",
    site: "@wegadgetbd",
    creator: "@wegadgetbd",
    images: ["/images/default.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon.svg",
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
      name: "We Gadget BD",
      alternateName: ["WeGadgetBD", "We Gadget Bangladesh", "We Gadget BD Online Shop"],
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
      name: "We Gadget BD",
      alternateName: "WeGadgetBD",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        url: `${siteUrl}/logo.png`,
        caption: "We Gadget BD Logo",
      },
      image: `${siteUrl}/images/default.png`,
      description:
        "We Gadget BD is Bangladesh's premier online store for 100% authentic gadgets, smartwatches, TWS earbuds, and premium tech accessories with cash on delivery and nationwide fast shipping.",
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
