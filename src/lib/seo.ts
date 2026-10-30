import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://wegadgetbd.com";
const DEFAULT_OG_IMAGE = "/images/default.png";

const stripTrailingSlash = (value: string) => value.replace(/\/$/, "");
const ensureLeadingSlash = (value: string) => (value.startsWith("/") ? value : `/${value}`);

export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL;
  return stripTrailingSlash(configuredUrl);
};

const toAbsoluteUrl = (value: string) => {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${getSiteUrl()}${ensureLeadingSlash(value)}`;
};

type PublicMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
};

export function buildPublicMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  image = DEFAULT_OG_IMAGE,
}: PublicMetadataInput): Metadata {
  const normalizedPath = ensureLeadingSlash(path);
  const canonical = `${getSiteUrl()}${normalizedPath}`;
  const openGraphImage = toAbsoluteUrl(image);

  return {
    title: `${title} | We Gadget BD`,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title: `${title} | We Gadget BD`,
      description,
      type: "website",
      url: canonical,
      siteName: "We Gadget BD",
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: `${title} | We Gadget BD`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | We Gadget BD`,
      description,
      images: [openGraphImage],
    },
  };
}
