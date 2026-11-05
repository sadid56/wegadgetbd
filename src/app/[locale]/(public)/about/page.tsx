import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "আমাদের সম্পর্কে" : "About Us",
    description:
      locale === "bn"
        ? "We Gadget BD সম্পর্কে জানুন, আমাদের লক্ষ্য, মূল্যবোধ ও অথেনটিক গ্যাজেট সরবরাহের প্রতিশ্রুতি।"
        : "Learn about We Gadget BD, our mission, values, and commitment to delivering premium gadgets with reliable customer support.",
    path: locale === "bn" ? "/bn/about" : "/about",
    keywords: ["about We Gadget BD", "tech brand", "premium electronics store", "gadgets bangladesh"],
  });
}

export default async function AboutPage() {
  const t = await getTranslations("info.about");
  return <ContentPageLayout title={t("title")} highlightedWord={t("highlightedWord")} markdown={t("markdown")} />;
}
