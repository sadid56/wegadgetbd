import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  appName: "BongoNex",
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  advanced: {
    cookiePrefix: "bongo-nex",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
      },
      banned: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});
