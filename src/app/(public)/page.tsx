import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo";
import LandingPage from "./_components/home-page-client";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "BongoNex | Premium Gadgets & Authentic Tech Store in Bangladesh",
  description:
    "Shop 100% authentic gadgets, smartwatches, TWS earbuds, lifestyle accessories, and premium tech gear in Bangladesh. Enjoy official warranty and fast nationwide delivery.",
  keywords: [
    "gadget shop Bangladesh",
    "authentic gadgets Dhaka",
    "buy smartwatches BD",
    "TWS earbuds Bangladesh",
    "original tech accessories",
    "online gadget store BD",
    "BongoNex",
    "Bongo Nex",
    "tech electronics online Bangladesh",
    "best gadget shop online",
  ],
  alternates: {
    canonical: `${siteUrl}/`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "BongoNex | Premium Gadgets & Authentic Tech Store in Bangladesh",
    description:
      "Shop 100% authentic gadgets, smartwatches, TWS earbuds, and premium tech gear with official warranty and fast delivery across Bangladesh.",
    url: `${siteUrl}/`,
    siteName: "BongoNex",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/default.png`,
        width: 1200,
        height: 630,
        alt: "BongoNex - Premium Gadget Store in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BongoNex | Premium Gadgets & Authentic Tech Store in Bangladesh",
    description:
      "Shop 100% authentic gadgets, smartwatches, TWS earbuds, and premium tech gear with official warranty and fast delivery across Bangladesh.",
    images: [`${siteUrl}/images/default.png`],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "BongoNex",
        alternateName: ["Bongo Nex", "BongoNex Bangladesh"],
        description:
          "Official online store for authentic gadgets, smartwatches, audio devices, and tech accessories in Bangladesh.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/products?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
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
          "Discover cutting-edge gadgets and components designed to power the future. Innovation meets quality at BONGO NEX with official warranty and nationwide delivery.",
        priceRange: "৳৳",
        currenciesAccepted: "BDT",
        paymentAccepted:
          "Cash on Delivery, Mobile Banking (bKash, Nagad), Credit Card, Debit Card",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BD",
          addressRegion: "Dhaka",
          addressLocality: "Dhaka",
        },
        areaServed: {
          "@type": "Country",
          name: "Bangladesh",
        },
        sameAs: [
          "https://www.facebook.com/BongoNexbd",
          "https://www.youtube.com/@BongoNexbd",
          "https://www.instagram.com/yourprofile",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["English", "Bengali"],
        },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: "BongoNex | Premium Gadgets & Authentic Tech Store in Bangladesh",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "Explore genuine smartwatches, earbuds, mobile accessories and tech gear in Bangladesh with trusted delivery.",
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Are your products 100% authentic?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely. We source our products directly from authorized global manufacturers and trusted distributors to ensure 100% authenticity for everything we sell.",
            },
          },
          {
            "@type": "Question",
            name: "How fast is your delivery service?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We pride ourselves on elite logistics. For orders within major hubs, expect delivery within 24–48 hours. Real-time tracking is provided for every shipment.",
            },
          },
          {
            "@type": "Question",
            name: "Do you provide any warranty for tech products?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, all our products come with either a manufacturer's official warranty or a Bongo Nex service warranty, depending on the item. Details are clearly listed on each product page.",
            },
          },
          {
            "@type": "Question",
            name: "What if I receive a defective item?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer a seamless 7-day replacement policy for manufacturing defects. Simply contact our 24/7 support team, and we'll handle the rest.",
            },
          },
          {
            "@type": "Question",
            name: "How can I track my order?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Once your order is dispatched, you'll receive a tracking link via SMS and email. You can also view your order status directly in your Bongo Nex account dashboard.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
