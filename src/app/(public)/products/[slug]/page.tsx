import type { Metadata } from "next";
import { db } from "@/db";
import { product, customerReview } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";
import { getSiteUrl } from "@/lib/seo";
import { getAssetUrl } from "@/lib/storage";
import ProductDetailsPage from "./_components/product-details-page-client";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = getSiteUrl();

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const foundProduct = await db.query.product.findFirst({
    where: and(
      or(eq(product.slug, slug), eq(product.id, slug)),
      eq(product.status, "ACTIVE")
    ),
    with: {
      category: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!foundProduct) {
    return {
      title: "Product Not Found | We Gadget BD",
      description: "The requested product is not available. Discover our latest gadgets, tech accessories and hot deals at We Gadget BD.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const effectivePrice = foundProduct.discountPrice ? Number(foundProduct.discountPrice) : Number(foundProduct.price);
  const brandName = foundProduct.brand ? `${foundProduct.brand} ` : "";
  const pageTitle = `${foundProduct.title} - Best Price in BD | We Gadget BD`;
  const pageDescription = `Buy authentic ${brandName}${foundProduct.title} in Bangladesh at ৳${effectivePrice.toLocaleString("en-BD")}. 100% genuine quality, official warranty, fast delivery & cash on delivery from We Gadget BD.`;
  const productUrl = `${siteUrl}/products/${foundProduct.slug}`;
  const ogImage = foundProduct.images?.[0] ? getAssetUrl(foundProduct.images[0]) : `${siteUrl}/images/default.png`;

  const keywords = [
    foundProduct.title,
    `${foundProduct.title} price in BD`,
    `${foundProduct.title} Bangladesh`,
    foundProduct.brand,
    foundProduct.model,
    foundProduct.category?.name,
    "authentic gadgets Bangladesh",
    "buy online BD",
    "We Gadget BD",
  ].filter(Boolean) as string[];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: productUrl,
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
      title: pageTitle,
      description: pageDescription,
      url: productUrl,
      siteName: "We Gadget BD",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: `${foundProduct.title} - We Gadget BD`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const { slug } = await params;

  const foundProduct = await db.query.product.findFirst({
    where: and(
      or(eq(product.slug, slug), eq(product.id, slug)),
      eq(product.status, "ACTIVE")
    ),
    with: {
      category: true,
      reviews: {
        where: eq(customerReview.status, "APPROVED"),
        orderBy: [desc(customerReview.createdAt)],
        limit: 5,
      },
    },
  });

  const effectivePrice = foundProduct
    ? foundProduct.discountPrice
      ? Number(foundProduct.discountPrice)
      : Number(foundProduct.price)
    : 0;

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const productUrl = foundProduct ? `${siteUrl}/products/${foundProduct.slug}` : `${siteUrl}/products`;

  // Schema.org Structured Data Graph
  const jsonLd = foundProduct
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `${productUrl}#product`,
            name: foundProduct.title,
            description: foundProduct.description || `Buy ${foundProduct.title} online in Bangladesh with official warranty from We Gadget BD.`,
            image: foundProduct.images && foundProduct.images.length > 0 ? foundProduct.images.map(getAssetUrl) : [`${siteUrl}/images/default.png`],
            sku: foundProduct.id,
            mpn: foundProduct.model || foundProduct.id,
            brand: {
              "@type": "Brand",
              name: foundProduct.brand || "We Gadget BD",
            },
            category: foundProduct.category?.name || "Gadgets",
            offers: {
              "@type": "Offer",
              url: productUrl,
              priceCurrency: "BDT",
              price: effectivePrice,
              priceValidUntil: nextYear.toISOString().split("T")[0],
              availability: foundProduct.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: "We Gadget BD",
                url: siteUrl,
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "BD",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 7,
                returnMethod: "https://schema.org/ReturnByMail",
                returnFees: "https://schema.org/FreeReturn",
              },
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: 120,
                  currency: "BDT",
                },
                shippingDestination: {
                  "@type": "DefinedRegion",
                  addressCountry: "BD",
                },
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: foundProduct.rating || 5.0,
              reviewCount: Math.max(1, foundProduct.reviews.length || foundProduct.soldCount || 10),
              bestRating: 5,
              worstRating: 1,
            },
            ...(foundProduct.reviews.length > 0 && {
              review: foundProduct.reviews.map((r) => ({
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: r.customerName,
                },
                datePublished: r.createdAt.toISOString().split("T")[0],
                reviewBody: r.review,
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: r.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
              })),
            }),
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${productUrl}#breadcrumb`,
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
              ...(foundProduct.category
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: foundProduct.category.name,
                      item: `${siteUrl}/products?category=${encodeURIComponent(foundProduct.category.slug)}`,
                    },
                    {
                      "@type": "ListItem",
                      position: 4,
                      name: foundProduct.title,
                      item: productUrl,
                    },
                  ]
                : [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: foundProduct.title,
                      item: productUrl,
                    },
                  ]),
            ],
          },
          {
            "@type": "ItemPage",
            "@id": `${productUrl}#webpage`,
            url: productUrl,
            name: `${foundProduct.title} - Best Price in BD | We Gadget BD`,
            isPartOf: {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: `${siteUrl}/`,
              name: "We Gadget BD",
            },
            mainEntity: {
              "@id": `${productUrl}#product`,
            },
            inLanguage: "en-US",
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ProductDetailsPage />
    </>
  );
}