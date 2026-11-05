import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "কুকি নীতি" : "Cookies Policy",
    description:
      locale === "bn"
        ? "We Gadget BD কীভাবে কুকিজ ব্যবহার করে তা বিস্তারিত জানুন।"
        : "Understand how We Gadget BD uses cookies and similar technologies to improve your experience.",
    path: locale === "bn" ? "/bn/cookies" : "/cookies",
    keywords: ["cookies policy", "tracking technologies", "website cookies"],
  });
}

export default async function CookiesPage() {
  const t = await getTranslations("info.cookies");
  return (
    <ContentPageLayout
      title={t("title")}
      highlightedWord={t("highlightedWord")}
      lastUpdated={t("lastUpdated")}
      markdown={t("markdown")}
    />
  );
}
