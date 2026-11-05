import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo";
import ShopPage from "./_components/products-page-client";

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
    ? "সকল গ্যাজেট ও এক্সেসরিজ | We Gadget BD"
    : "All Products - Premium Gadgets & Tech Accessories | We Gadget BD";

  const description = isBn
    ? "বাংলাদেশে ১০০% অথেনটিক গ্যাজেটের বিশাল কালেকশন। ফিল্টার করুন আসল স্মার্টওয়াচ, ইয়ারবাডস এবং মোবাইল এক্সেসরিজ ক্যাটাগরি ও বাজেট অনুযায়ী।"
    : "Explore our complete collection of 100% authentic gadgets in Bangladesh. Filter original smartwatches, TWS earbuds, phone accessories, and tech electronics by category and price.";

  const canonicalUrl = isBn ? `${siteUrl}/bn/products` : `${siteUrl}/products`;

  return {
    title,
    description,
    keywords: [
      "all gadgets Bangladesh",
      "authentic gadgets online",
      "gadget shop BD",
      "smartwatches collection",
      "wireless earbuds Bangladesh",
      "tech accessories store",
      "We Gadget BD products",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/products`,
        bn: `${siteUrl}/bn/products`,
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
          alt: "All Products - We Gadget BD Gadgets Store",
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

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const currentUrl = isBn ? `${siteUrl}/bn/products` : `${siteUrl}/products`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${currentUrl}#webpage`,
        url: currentUrl,
        name: isBn ? "সকল গ্যাজেট ও এক্সেসরিজ | We Gadget BD" : "All Products - Premium Gadgets & Tech Accessories | We Gadget BD",
        description: isBn
          ? "বাংলাদেশে ১০০% অথেনটিক গ্যাজেটের বিশাল কালেকশন।"
          : "Explore our complete collection of 100% authentic gadgets in Bangladesh with official warranty and fast delivery.",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${currentUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isBn ? "হোম" : "Home",
            item: isBn ? `${siteUrl}/bn/` : `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isBn ? "পণ্যসমূহ" : "Products",
            item: currentUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopPage />
    </>
  );
}
