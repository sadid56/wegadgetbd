import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";

export const metadata: Metadata = buildPublicMetadata({
  title: "Privacy Policy",
  description: "Read how BongoNex collects, uses, and protects your personal information.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "user privacy"],
});

const PRIVACY_MARKDOWN = `
## 1. Introduction
Welcome to **BongoNex**. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.

## 2. Data We Collect
We may collect, use, store and transfer different kinds of personal data about you, including:

- **Identity Data:** name, username.
- **Contact Data:** email address, telephone numbers, billing address.
- **Technical Data:** internet protocol (IP) address, login data, browser type and version.
- **Usage Data:** information about how you use our website, products and services.

## 3. How We Use Your Data
We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:

- To register you as a new customer.
- To process and deliver your order.
- To manage our relationship with you.
- To improve our website, products/services, marketing or customer relationships.

## 4. Data Security
We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.

## 5. Your Legal Rights
Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.

## 6. Contact Us
If you have any questions about this privacy policy or our privacy practices, please contact us at:

- **Email:** [support@bongonex.com](mailto:support@bongonex.com)
- **Phone:** +880 1784972403
`;

export default function PrivacyPage() {
  return <ContentPageLayout title='Privacy Policy' highlightedWord='Policy' lastUpdated='February 9, 2026' markdown={PRIVACY_MARKDOWN} />;
}
