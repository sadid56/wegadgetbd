# We Gadget BD

**We Gadget BD** is a modern, high-performance, full-stack e-commerce web platform designed for authentic tech gadgets, premium accessories, and electronics in Bangladesh. Built with Next.js 16 (React 19), contract-first type safety via oRPC, Drizzle ORM, Supabase Auth (SSR Server Actions), and Supabase Storage.

---

## 🚀 Key Features

### 🛍️ Storefront Experience
- **Dynamic Product Catalog**: Filter products by categories (Laptops, Smartphones, Audio, Gaming, Smart Home, Accessories), label tags (*New, Hot Deals, Best Seller*), price ranges, and live search.
- **Product Details & Media Showcase**: High-resolution image galleries with pinch-to-zoom (`react-zoom-pan-pinch`), responsive video embeds, rich markdown specifications, and related products.
- **Cart & Instant Checkout**: Persistent cart drawer, fast Buy Now modal, and Cash on Delivery (COD) checkout tailored for Bangladeshi delivery zones (Inside Dhaka / Outside Dhaka).
- **Customer Reviews & UGC**: Verified customer ratings, multimedia reviews (photos and video uploads), and testimonials.
- **Direct WhatsApp Ordering**: Floating contact button and order confirmation sharing directly via WhatsApp.
- **SEO & Social Optimization**: Dynamic OpenGraph previews, automated product sitemaps, and rich JSON-LD structured data for search engine ranking.

### 🛡️ Admin Management Dashboard
- **Product Management**: Create, edit, publish, categorize, and archive products with rich markdown descriptions, featured banners, and multi-image uploads.
- **Category & Taxonomy**: Manage store departments, slug hierarchies, and visual icons.
- **Orders & Fulfillment**: Real-time order pipeline, status transitions (*Pending, Processing, Shipped, Delivered, Cancelled*), and device/browser analytics.
- **Financials & Expense Tracking**: Date-filtered income summaries, operational expense logging, and revenue insights.
- **Customer Reviews Moderation**: Approve, reject, or feature customer ratings and review media.

### 🔐 Authentication (SSR Server Actions)
- **Server Actions Architecture**: Authentication operations are handled entirely on the server (`src/actions/auth.ts`) using Supabase Auth with secure HTTP cookies (`sb-access-token`, `sb-refresh-token`).
- **Flexible Sign In / Sign Up**: Email and password credentials with client-side Zod validation, alongside seamless Google OAuth sign-in.
- **Clean & Cohesive UI**: Minimalist, distraction-free auth layout matching the storefront aesthetic with one-click "Back to Home" navigation.

### 📦 Storage & Asset Architecture
- **Supabase Storage**: Media hosted on the `we-gadgets` bucket.
- **Domain-Agnostic Database Records**: Images are saved without full domains (format: `<bucket>/<folder>/<filename>`), allowing instant domain or CDN migrations (e.g., to Cloudflare R2 or AWS S3) without modifying database rows.
- **Centralized Resolution**: All assets are resolved dynamically via `getAssetUrl()` and `ASSETS_URL` in `src/lib/storage.ts`.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **API & RPC Layer** | [oRPC](https://orpc.unnoq.com/) (Contract-First type-safe RPC) |
| **Data Fetching & Cache** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) via Next.js SSR Server Actions |
| **File Storage** | [Supabase Storage](https://supabase.com/storage) (`we-gadgets` bucket) |
| **UI Components & Icons** | [Material UI (MUI v9)](https://mui.com/) + [@emotion](https://emotion.sh/), [@mui/icons-material](https://mui.com/material-ui/material-icons/) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) |
| **Markdown & Media** | [@uiw/react-md-editor](https://uiwjs.github.io/react-md-editor/), [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) (SMTP / Gmail App Passwords) |

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have the following installed locally:
- **Node.js**: `v20.x` or later
- **pnpm**: `v9.x` or later (or npm / yarn / bun)
- **PostgreSQL**: A local PostgreSQL database or hosted instance (e.g., Supabase, Neon, AWS RDS)

### 2. Installation
Clone the repository and install project dependencies:

```bash
git clone <repository-url>
cd wegadgetbd
pnpm install
```

### 3. Environment Configuration
Create a local `.env.local` file by copying the sample:

```bash
cp .env.example .env.local
```

Configure the necessary environment variables in `.env.local`:

```env
# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# PostgreSQL Database (Drizzle ORM)
DATABASE_URL="postgresql://postgres:password@localhost:5432/we_gadget_bd?schema=public"

# Supabase (Auth & Storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"

# Storage CDN / Asset URL (Optional override)
# NEXT_PUBLIC_ASSETS_URL="https://your-project.supabase.co"

# Email / SMTP
GOOGLE_APP_EMAIL="your-email@gmail.com"
GOOGLE_APP_PASSWORD="your-app-password"
```

### 4. Database Setup
Push the Drizzle schema directly to your database:

```bash
# Push schema changes to database
pnpm db:push

# (Optional) Open Drizzle Studio to browse records visually
pnpm db:studio
```

### 5. Running the Application
Start the local development server:

```bash
pnpm dev
```

Open your browser and navigate to:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Sign In**: [http://localhost:3000/auth/sign-in](http://localhost:3000/auth/sign-in)

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server with Turbopack |
| `pnpm build` | Builds the production bundle |
| `pnpm start` | Starts the production server |
| `pnpm lint` | Runs ESLint static code analysis |
| `pnpm db:push` | Pushes the Drizzle schema directly to the database |
| `pnpm db:generate` | Generates database migration files via Drizzle Kit |
| `pnpm db:migrate` | Runs pending Drizzle migrations |
| `pnpm db:studio` | Launches the interactive Drizzle Studio database viewer |
| `pnpm clean` | Cleans `.next` build cache and `node_modules` |

---

## 🌐 Production Deployment

The application can be deployed to [Vercel](https://vercel.com):

1. Connect your repository to Vercel.
2. In Project Settings, enter the environment variables defined in `.env.example`.
3. Set the build command to `pnpm build`.
4. Deploy and verify your domain and Supabase redirect URLs (`/auth/callback`).

---

## 📄 License

This project is proprietary and confidential. © We Gadget BD. All rights reserved.
