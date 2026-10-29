import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";

export const metadata: Metadata = buildPublicMetadata({
  title: "Terms of Service",
  description: "Review the terms and conditions for shopping and using services on BongoNex.",
  path: "/terms",
  keywords: ["terms of service", "ecommerce terms", "purchase policy"],
});

const TERMS_MARKDOWN = `
## 1. Terms of Use
By accessing BongoNex, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.

## 2. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on BongoNex's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials.
- Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).
- Attempt to decompile or reverse engineer any software contained on BongoNex's website.
- Remove any copyright or other proprietary notations from the materials.

## 3. E-Commerce Terms
When you purchase products through BongoNex, you agree to provide current, complete, and accurate purchase and account information. We reserve the right to refuse any order you place with us. Prices for our products are subject to change without notice.

## 4. Disclaimer
The materials on BongoNex's website are provided on an 'as is' basis. BongoNex makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 5. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
`;

export default function TermsPage() {
  return <ContentPageLayout title='Terms of Service' highlightedWord='Service' lastUpdated='February 9, 2026' markdown={TERMS_MARKDOWN} />;
}
