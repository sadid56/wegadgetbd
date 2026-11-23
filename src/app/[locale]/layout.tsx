import { routing } from "@/i18n/routing-config";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { RootDocumentShell, rootMetadata, rootViewport } from "@/components/layouts/root-document-shell";
import { LocaleSync } from "./local-sync";

export const viewport = rootViewport;
export const metadata = rootMetadata;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <RootDocumentShell locale={locale} includeRootJsonLd>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <LocaleSync />
        {children}
      </NextIntlClientProvider>
    </RootDocumentShell>
  );
}
