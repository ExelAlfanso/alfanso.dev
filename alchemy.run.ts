import { Stack } from "alchemy";
import {
  state as cloudflareState,
  D1,
  type InferEnv,
  providers,
  R2,
  Website,
  Worker,
} from "alchemy/Cloudflare";
import { String as ConfigString, Redacted } from "effect/Config";
import { gen } from "effect/Effect";

const database = D1.Database("Database", {
  migrations: "./packages/db/migrations",
  name: "alfanso-cms",
});
const media = R2.Bucket("CmsMedia", { name: "alfanso-cms-media" });
const web = Website.Vite("Web", {
  assets: { notFoundHandling: "single-page-application" },
  domain: "alfanso.xyz",
  env: { VITE_API_URL: "https://api.alfanso.xyz" },
  rootDir: "./apps/web",
});

const api = Worker("Api", {
  compatibility: {
    date: "2026-10-06",
    flags: ["nodejs_compat"],
  },
  domain: "api.alfanso.xyz",
  env: {
    ADMIN_EMAILS: ConfigString("ADMIN_EMAILS"),
    BETTER_AUTH_SECRET: Redacted("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: "https://api.alfanso.xyz",
    DB: database,
    GOOGLE_CLIENT_ID: ConfigString("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: Redacted("GOOGLE_CLIENT_SECRET"),
    MEDIA: media,
    TRUSTED_ORIGINS: "https://alfanso.xyz,https://www.alfanso.xyz",
  },
  main: "./apps/api/src/index.ts",
});

export type ApiEnv = InferEnv<typeof api>;

export default Stack(
  "Alfanso",
  { providers: providers(), state: cloudflareState() },
  gen(function* () {
    const worker = yield* api;
    const website = yield* web;
    return { apiUrl: worker.url, webUrl: website.url };
  })
);
