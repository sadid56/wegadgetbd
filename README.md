# BongoNex

BongoNex is a modern, high-performance, full-stack e-commerce web application designed with contract-first type safety, real-time analytics, and seamless shopping experiences.

---

## Key Features

### Storefront Experience
- **Dynamic Product Catalog**: Filter products by categories, labels (New, Special, Best Seller), price ranges, and real-time search.
- **Product Details & Media**: High-resolution image galleries, video embed support, customer reviews, and specifications.
- **Cart & Fast Checkout**: Streamlined cart drawer and responsive checkout flow supporting delivery options and discounts.
- **Customer Reviews**: Verified customer ratings, feedback submission, and review showcase.
- **Newsletter Subscription**: Email collection with OTP-based verification.
- **Floating Contact & WhatsApp Tracking**: Direct WhatsApp inquiries with click events and Facebook Pixel tracking.

### Admin Dashboard
- **Product Management**: Create, edit, publish, categorize, and archive products with rich markdown descriptions.
- **Category & Taxonomy Controls**: Organize store departments, slugs, and visual icons.
- **Sales & Orders Monitoring**: Detailed sales overview, status transitions, and revenue analytics.
- **Payments & Expense Tracking**: Date-filtered transaction logs, expense notes, and financial audits.
- **Audit Logging**: Traceable activity logs of administrator actions, logins, and status updates.
- **Marketing & Tracking**: Facebook Pixel integration and custom conversion event tracking.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **API & RPC Architecture**: [oRPC](https://orpc.unnoq.com/) (Contract-First type-safe RPC layer with TanStack Query integration)
- **Data Fetching & Cache**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Session management & Google OAuth)
- **File & Media Storage**: [Supabase Storage](https://supabase.com/)
- **Cache & Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **Communications**: [Nodemailer](https://nodemailer.com/) (Email), [Twilio](https://www.twilio.com/) (SMS OTP), [ntfy.sh](https://ntfy.sh/) (Push Alerts)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Motion](https://motion.dev/), [Sonner](https://sonner.emilkowal.ski/), [Lucide](https://lucide.dev/)

---

## Getting Started

### 1. Prerequisites
Make sure you have installed:
- **Node.js**: `v20.x` or later
- **pnpm**: `v9.x` or later (or npm / yarn / bun)
- **PostgreSQL**: Local instance or hosted provider (e.g. Supabase, Neon)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd bongo-nex
pnpm install
```

### 3. Environment Configuration
Copy the sample environment file to create your local environment:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure the required variables:
- `DATABASE_URL` & `DIRECT_URL`: Your PostgreSQL database connections.
- `BETTER_AUTH_SECRET`: A secure 32+ character random secret (`openssl rand -base64 32`).
- `NEXT_PUBLIC_APP_URL`: Set to `http://localhost:3000` for development.
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase credentials for media uploads.
- `KV_REST_API_URL` & `KV_REST_API_TOKEN`: Upstash Redis instance credentials.
- `GOOGLE_APP_EMAIL` & `GOOGLE_APP_PASSWORD`: SMTP credentials for verification emails.

### 4. Database Setup
Generate Prisma Client and apply migrations to your database:

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Running the Application
Start the development server with Turbopack:

```bash
pnpm dev
```

Access the application in your browser:
- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server |
| `pnpm build` | Compiles and builds the application for production |
| `pnpm start` | Launches the compiled production server |
| `pnpm lint` | Runs ESLint to check for code quality and style issues |
| `npx tsc --noEmit` | Runs TypeScript compiler to verify static types |
| `npx prisma studio` | Launches Prisma Studio GUI for browsing database records |

---

## Production Deployment

The project can be deployed seamlessly to platforms like [Vercel](https://vercel.com):

1. Push your code to your Git provider (GitHub, GitLab, or Bitbucket).
2. Import the repository into Vercel.
3. Configure the environment variables from your `.env.local` in the Vercel Project Settings.
4. Set the build command to `prisma generate && next build`.
5. Deploy and monitor via the Vercel dashboard.

---

## License

This project is private and proprietary. All rights reserved.
