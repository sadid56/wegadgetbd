import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";
import { ContentPageLayout } from "@/components/layouts/content-page-layout";

export const metadata: Metadata = buildPublicMetadata({
  title: "Cookies Policy",
  description: "Understand how BongoNex uses cookies and similar technologies to improve your experience.",
  path: "/cookies",
  keywords: ["cookies policy", "tracking technologies", "website cookies"],
});

const COOKIES_MARKDOWN = `
## 1. What are Cookies
Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the website or a third-party to recognize you and make your next visit easier and the website more useful to you.

## 2. How BongoNex Uses Cookies
When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:

- **Essential Cookies:** We may use cookies to remember information that changes how the Service looks or behaves, such as a user's language preference on the Service.
- **Account Related:** If you create an account with us, we will use cookies for the management of the signup process and general administration.
- **Login Related:** We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.

## 3. Third-party Cookies
In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.

## 4. Your Choices Regarding Cookies
If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.

## 5. More Information
You can learn more about cookies at AllAboutCookies: [allaboutcookies.org](http://www.allaboutcookies.org/)
`;

export default function CookiesPage() {
  return <ContentPageLayout title='Cookies Policy' highlightedWord='Policy' lastUpdated='February 9, 2026' markdown={COOKIES_MARKDOWN} />;
}
