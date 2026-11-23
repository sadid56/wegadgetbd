# Dependency Update & Compatibility Guide

এই ডকুমেন্টে প্রজেক্টের প্যাকেজ/ডিপেনডেন্সি নিরাপদভাবে আপডেট করার ধাপ এবং আপডেটের আগে compatibility চেক করার নিয়ম দেওয়া হলো।

---

## ১. আপডেটের আগে যেভাবে যাচাই করবেন

### ১.১ কোন প্যাকেজগুলোতে আপডেট আছে দেখুন
```bash
pnpm outdated
```
- **Wanted**: বর্তমান সেমান্টিক রেঞ্জ (`^`) অনুযায়ী নিরাপদ minor/patch আপডেট।
- **Latest**: একদম নতুন ভার্সন (major version জাম্প থাকতে পারে)।

### ১.২ ইনস্টল না করেই Peer Dependencies চেক করুন
কোনো প্যাকেজের নতুন ভার্সন বর্তমান `next`, `react`, `@mui/material`, বা `eslint`-এর সাথে কম্প্যাটিবল কি না তা ইনস্টল করার আগেই registry থেকে দেখে নিন:

```bash
pnpm view eslint-config-next@latest peerDependencies
pnpm view next-intl@latest peerDependencies
pnpm view @mui/x-date-pickers@latest peerDependencies
pnpm view @toolpad/core@latest peerDependencies
pnpm view @hookform/resolvers@latest peerDependencies
```

যদি দেখেন নতুন ভার্সনে আপনার বর্তমান কোর প্যাকেজের ভার্সন সাপোর্ট করা আছে, তবেই সেটি আপডেট করুন।

---

## ২. প্রজেক্টের গুরুত্বপূর্ণ প্যাকেজ গ্রুপ (একসাথে বা সাবধানে আপডেট করুন)

সব প্যাকেজ একসাথে `pnpm up --latest` না দিয়ে ইন্টারঅ্যাক্টিভভাবে চালান:
```bash
pnpm up -i --latest
```

বিশেষভাবে নিচের গ্রুপগুলো একসাথে ও কম্প্যাটিবিলিটি দেখে আপডেট করবেন:

1. **Next.js + ESLint + i18n:**
   - `next` এবং `eslint-config-next` সবসময় **একই ভার্সনে** রাখুন।
   - `next-intl` নতুন `next` ভার্সন সাপোর্ট করে কি না চেক করুন।
2. **oRPC প্যাকেজসমূহ:**
   - `@orpc/client`, `@orpc/contract`, `@orpc/server`, `@orpc/tanstack-query` — সবগুলো সবসময় **একই ভার্সনে** আপডেট করুন।
3. **MUI ও Toolpad:**
   - `@mui/material`, `@mui/icons-material`, `@mui/material-nextjs`, `@mui/x-date-pickers`, `@toolpad/core`।
   - `package.json`-এর `pnpm.peerDependencyRules.allowedVersions` অনুযায়ী MUI ও Next-এর সাথে মিল আছে কি না দেখে নিন।
4. **Form ও Validation:**
   - `zod`, `react-hook-form`, `@hookform/resolvers` — major আপডেটে `zodResolver` টাইপ ব্রেক করে কি না চেক করুন।
5. **Database (Drizzle):**
   - `drizzle-orm` এবং `drizzle-kit` একসাথে কম্প্যাটিবল ভার্সনে রাখুন।
6. **TypeScript:**
   - `package.json`-এ `pnpm.overrides.typescript` এবং `ignoreDependencies` সেট করা আছে; TypeScript major আপডেট করলে টাইপ এরর বা ওভাররাইড রিভিউ করুন।

---

## ৩. আপডেটের পরের চেকলিস্ট

নতুন একটি গিট ব্রাঞ্চে (`git checkout -b chore/deps-update`) আপডেট করে নিচের সবগুলো চেক পাস করান:

```bash
# ১. টাইপচেক ও লিন্ট
npx tsc --noEmit && pnpm lint

# ২. প্রোডাকশন বিল্ড
pnpm build

# ৩. সিকিউরিটি অডিট
pnpm audit
```

### ম্যানুয়াল কুইক টেস্ট
- **Auth:** Sign in / Sign up / Google OAuth
- **AI Assistant:** `FloatingAiChat` ড্রয়ার ও `/api/ai-assistant` রেসপন্স
- **Admin Forms ও DatePicker:** Product Form, Payment Dialog, Sale Dialog, Promo Code Modal
- **Storefront:** Product listing, Product details, Cart ও Checkout ফ্লো
