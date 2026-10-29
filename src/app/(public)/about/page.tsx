import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";

export const metadata: Metadata = buildPublicMetadata({
  title: "About Us",
  description: "Learn about BongoNex, our mission, values, and commitment to delivering premium gadgets with reliable customer support.",
  path: "/about",
  keywords: ["about BongoNex", "tech brand", "premium electronics store", "gadgets bangladesh"],
});

const ABOUT_MARKDOWN = `
## 1. Who We Are
BongoNex is a premier destination for tech enthusiasts and gadget lovers in Bangladesh. We believe that technology should be more than just functional—it should inspire creativity, simplify everyday life, and deliver exceptional experiences.

Founded with a passion for excellence, BongoNex connects discerning customers with top-tier gadgets, accessories, and computing equipment with absolute authenticity and reliability.

## 2. Our Mission & Vision
- **Our Mission:** To empower people across Bangladesh by providing seamless access to genuine, cutting-edge technology with transparent pricing and exceptional customer care.
- **Our Vision:** To establish BongoNex as the most trusted and loved electronics destination in the nation.

## 3. Core Values
- **100% Genuine Products:** Every product in our catalog is verified and sourced to guarantee authenticity and performance.
- **Customer First:** We stand behind every order with dedicated after-sales assistance and clear guidance.
- **Innovation & Quality:** We curate products from globally renowned brands known for durability and technological leadership.
- **Integrity & Transparency:** Fair pricing, clear warranty policies, and straightforward customer communication.

## 4. Why Choose BongoNex?
- **Nationwide Coverage:** Fast and reliable delivery to all 64 districts in Bangladesh.
- **Official Warranty:** Trusted warranty protection with hassle-free support.
- **Secure Payments:** Multiple payment channels including bKash, Nagad, card payments, and Cash on Delivery.
- **Responsive Support:** Professional assistance ready to resolve questions before and after your purchase.

## 5. Get in Touch
Have questions, suggestions, or partnership inquiries? We would love to hear from you.

- **Email:** [support@bongonex.com](mailto:support@bongonex.com)
- **Phone:** +880 1784972403
- **Address:** Dhaka, Bangladesh
`;

export default function AboutPage() {
  return <ContentPageLayout title='About Us' highlightedWord='Us' markdown={ABOUT_MARKDOWN} />;
}
