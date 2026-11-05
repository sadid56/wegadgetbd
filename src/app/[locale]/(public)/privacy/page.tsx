import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy",
    description:
      locale === "bn"
        ? "We Gadget BD কীভাবে আপনার তথ্য সংগ্রহ, সংরক্ষণ ও সুরক্ষা করে তা জানুন।"
        : "Read how We Gadget BD collects, uses, and protects your personal information.",
    path: locale === "bn" ? "/bn/privacy" : "/privacy",
    keywords: ["privacy policy", "data protection", "user privacy"],
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations("info.privacy");
  return (
    <ContentPageLayout
      title={t("title")}
      highlightedWord={t("highlightedWord")}
      lastUpdated={t("lastUpdated")}
      markdown={t("markdown")}
    />
  );
}
