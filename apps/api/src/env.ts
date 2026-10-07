export interface Env {
  ADMIN_EMAILS: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  MEDIA: R2Bucket;
  TRUSTED_ORIGINS: string;
}

export function getTrustedOrigins(env: Env): string[] {
  return env.TRUSTED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
