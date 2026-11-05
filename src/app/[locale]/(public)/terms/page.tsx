import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicMetadata({
    title: locale === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service",
    description:
      locale === "bn"
        ? "We Gadget BD-এ কেনাকাটা ও সেবা ব্যবহারের নিয়ম ও শর্তাবলী জানুন।"
        : "Review the terms and conditions for shopping and using services on We Gadget BD.",
    path: locale === "bn" ? "/bn/terms" : "/terms",
    keywords: ["terms of service", "ecommerce terms", "purchase policy"],
  });
}

export default async function TermsPage() {
  const t = await getTranslations("info.terms");
  return (
    <ContentPageLayout
      title={t("title")}
      highlightedWord={t("highlightedWord")}
      lastUpdated={t("lastUpdated")}
      markdown={t("markdown")}
    />
  );
}
