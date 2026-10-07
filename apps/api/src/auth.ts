import { authSchema } from "@alfanso/db/schema";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import type { Env } from "./env";

export function createAuth(env: Env) {
  const secureCookies = env.BETTER_AUTH_URL.startsWith("https://");
  const adminEmails = new Set(
    env.ADMIN_EMAILS.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );

  return betterAuth({
    advanced: {
      defaultCookieAttributes: {
        sameSite: secureCookies ? "none" : "lax",
        secure: secureCookies,
      },
    },
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(drizzle(env.DB, { schema: authSchema }), {
      provider: "sqlite",
    }),
    databaseHooks: {
      user: {
        create: {
          before: (newUser) =>
            Promise.resolve(
              adminEmails.has(newUser.email.trim().toLowerCase())
                ? { data: { ...newUser, role: "admin" } }
                : undefined
            ),
        },
      },
    },
    emailAndPassword: { enabled: false },
    plugins: [admin({ adminRoles: ["admin"], defaultRole: "user" })],
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        requireEmailVerification: true,
      },
    },
    trustedOrigins: env.TRUSTED_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    user: {
      validateUserInfo: ({ user }) => {
        if (!(user.email && adminEmails.has(user.email.trim().toLowerCase()))) {
          return {
            error: "admin_email_not_allowed",
            errorDescription:
              "This Google account is not allowed to access the CMS.",
          };
        }
      },
    },
  });
}
