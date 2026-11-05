import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo";
import LandingPage from "./_components/home-page-client";

const siteUrl = getSiteUrl();

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  const title = isBn
    ? "We Gadget BD | সেরা প্রযুক্তির গ্যাজেট শপ বাংলাদেশ"
    : "We Gadget BD | Smarter Tech • Brighter Days";

  const description = isBn
    ? "বাংলাদেশে ১০০% অথেনটিক গ্যাজেট, স্মার্টওয়াচ, TWS ইয়ারবাডস এবং প্রিমিয়াম টেক এক্সেসরিজ কিনুন অফিসিয়াল ওয়ারেন্টি ও দ্রুত ক্যাশ অন ডেলিভারি সহ।"
    : "Shop 100% authentic gadgets, smartwatches, TWS earbuds, lifestyle accessories, and premium tech gear in Bangladesh. Enjoy official warranty and fast nationwide delivery.";

  const canonicalUrl = isBn ? `${siteUrl}/bn/` : `${siteUrl}/`;

  return {
    title,
    description,
    keywords: [
      "gadget shop Bangladesh",
      "authentic gadgets Dhaka",
      "buy smartwatches BD",
      "TWS earbuds Bangladesh",
      "original tech accessories",
      "online gadget store BD",
      "We Gadget BD",
      "WeGadgetBD",
      "tech electronics online Bangladesh",
      "best gadget shop online",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/`,
        bn: `${siteUrl}/bn/`,
      },
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
      title,
      description,
      url: canonicalUrl,
      siteName: "We Gadget BD",
      locale: isBn ? "bn_BD" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/default.png`,
          width: 1200,
          height: 630,
          alt: "We Gadget BD - Premium Gadget Store in Bangladesh",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/default.png`],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const currentUrl = isBn ? `${siteUrl}/bn/` : `${siteUrl}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: currentUrl,
        name: "We Gadget BD",
        alternateName: ["WeGadgetBD", "We Gadget Bangladesh"],
        description: isBn
          ? "বাংলাদেশে অথেনটিক গ্যাজেট, স্মার্টওয়াচ, অডিও ডিভাইস এবং টেক এক্সেসরিজের নির্ভরযোগ্য অনলাইন শপ।"
          : "Official online store for authentic gadgets, smartwatches, audio devices, and tech accessories in Bangladesh.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/products?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: isBn ? "bn-BD" : "en-US",
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
          "Discover cutting-edge gadgets and components designed to power the future. Innovation meets quality at We Gadget BD with official warranty and nationwide delivery.",
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
          "https://www.facebook.com/wegadgetbd",
          "https://www.youtube.com/@wegadgetbd",
          "https://www.instagram.com/wegadgetbd",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["English", "Bengali"],
        },
      },
      {
        "@type": "WebPage",
        "@id": `${currentUrl}#webpage`,
        url: currentUrl,
        name: isBn
          ? "We Gadget BD | সেরা প্রযুক্তির গ্যাজেট শপ বাংলাদেশ"
          : "We Gadget BD | Smarter Tech • Brighter Days",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        description: isBn
          ? "বাংলাদেশে অথেনটিক গ্যাজেট, স্মার্টওয়াচ ও এক্সেসরিজ সেরা মূল্যে ও দ্রুত ডেলিভারিতে কিনুন।"
          : "Explore genuine smartwatches, earbuds, mobile accessories and tech gear in Bangladesh with trusted delivery.",
        inLanguage: isBn ? "bn-BD" : "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": `${currentUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: isBn ? "আপনাদের পণ্যগুলো কি ১০০% অরিজিনাল?" : "Are your products 100% authentic?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isBn
                ? "অবশ্যই। আমরা প্রতিটি পণ্য সরাসরি অনুমোদিত আন্তর্জাতিক প্রস্তুতকারক ও বিশ্বস্ত ডিস্ট্রিবিউটরদের থেকে সংগ্রহ করি।"
                : "Absolutely. We source our products directly from authorized global manufacturers and trusted distributors to ensure 100% authenticity for everything we sell.",
            },
          },
          {
            "@type": "Question",
            name: isBn ? "ডেলিভারি পেতে কতদিন সময় লাগে?" : "How fast is your delivery service?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isBn
                ? "আমরা দ্রুততম ডেলিভারি নিশ্চিত করি। বিভাগীয় শহরের মধ্যে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়।"
                : "We pride ourselves on elite logistics. For orders within major hubs, expect delivery within 24–48 hours. Real-time tracking is provided for every shipment.",
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
