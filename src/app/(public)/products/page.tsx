import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo";
import ShopPage from "./_components/products-page-client";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "All Products - Premium Gadgets & Tech Accessories | BongoNex",
  description:
    "Explore our complete collection of 100% authentic gadgets in Bangladesh. Filter original smartwatches, TWS earbuds, phone accessories, and tech electronics by category and price.",
  keywords: [
    "all gadgets Bangladesh",
    "authentic gadgets online",
    "gadget shop BD",
    "smartwatches collection",
    "wireless earbuds Bangladesh",
    "tech accessories store",
    "BongoNex products",
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
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
    title: "All Products - Premium Gadgets & Tech Accessories | BongoNex",
    description: "Explore our complete collection of 100% authentic gadgets in Bangladesh with official warranty and fast delivery.",
    url: `${siteUrl}/products`,
    siteName: "BongoNex",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/default.png`,
        width: 1200,
        height: 630,
        alt: "All Products - BongoNex Gadgets Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products - Premium Gadgets & Tech Accessories | BongoNex",
    description: "Explore our complete collection of 100% authentic gadgets in Bangladesh with official warranty and fast delivery.",
    images: [`${siteUrl}/images/default.png`],
  },
};

export default function ProductsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/products#webpage`,
        url: `${siteUrl}/products`,
        name: "All Products - Premium Gadgets & Tech Accessories | BongoNex",
        description: "Explore our complete collection of 100% authentic gadgets in Bangladesh with official warranty and fast delivery.",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: `${siteUrl}/`,
          name: "BongoNex",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/products#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/products`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopPage />
    </>
  );
}
