import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import AboutPage from "./_components/about-page-client";

export const metadata: Metadata = buildPublicMetadata({
  title: "About Us",
  description:
    "Learn about BongoNex, our mission, values, and commitment to delivering premium gadgets with reliable customer support.",
  path: "/about",
  keywords: ["about BongoNex", "tech brand", "premium electronics store"],
});

export default function About() {
  return <AboutPage />;
}
