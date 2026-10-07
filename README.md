# alfanso.xyz

Portfolio and admin CMS. The Vite frontend lives in `apps/web`; the Hono API, Better Auth, and R2 media handler live in `apps/api`; D1 schema and migrations live in `packages/db`.

## Local development

Install the workspace, then create the ignored files `apps/api/.dev.vars` and `apps/web/.env.local` on your machine:

```text
# apps/api/.dev.vars — fill these from your own Google OAuth setup
BETTER_AUTH_SECRET=<random secret, at least 32 characters>
GOOGLE_CLIENT_ID=<Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
ADMIN_EMAILS=<comma-separated exact Google email addresses allowed as admins>
```

```text
# apps/web/.env.local
VITE_API_URL=http://localhost:8787
```

In Google Cloud Console, create a **Web application** OAuth client and set:

- Authorized redirect URI: `http://localhost:8787/api/auth/callback/google`
- Authorized JavaScript origin: `http://localhost:5173`

Apply the local D1 migrations (including the initial portfolio projects), copy every raster image from `apps/web/public` to the local R2 emulator, and start both apps:

```powershell
pnpm db:migrate:local
pnpm media:upload:local
pnpm dev
```

Open `http://localhost:5173/admin/login`. Password sign-in is disabled. Google OAuth accepts only exact addresses in `ADMIN_EMAILS`; the first allowed login is assigned the admin role. Other Google accounts are rejected. The CMS checks the admin session before rendering, and the API checks session and role for every write.

## Production configuration

`alchemy.run.ts` deploys the API Worker to `api.alfanso.xyz` and the Vite website from `apps/web` to `alfanso.xyz`, alongside the private `alfanso-cms-media` R2 bucket and D1 database. The Cloudflare zone for `alfanso.xyz` must exist in the same Cloudflare account; Alchemy creates the custom-domain DNS records and certificates on deployment. This repository change does not deploy these resources or change live DNS.

Set these values in the Alchemy environment before deployment:

- `BETTER_AUTH_SECRET`: random server-only secret, at least 32 characters.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth Web client values. Keep the secret server-side.
- `ADMIN_EMAILS`: comma-separated, exact Google email addresses that may administer the CMS.

For the production Google OAuth client, add:

- Authorized redirect URI: `https://api.alfanso.xyz/api/auth/callback/google`
- Authorized JavaScript origin: `https://alfanso.xyz` (and `https://www.alfanso.xyz` if used)

Alchemy injects the public API origin into the Vite build as `VITE_API_URL`. No Better Auth or Google secret is exposed to Vite.

Run `pnpm media:upload` after the production R2 bucket exists and Wrangler is authenticated. It uploads all raster images in `apps/web/public` into the production bucket using this key layout:

- `projects/<project-slug>.<extension>`
- `profile/<profile-image>.png|jpg`
- `tech-stack/<technology>.png`
- `brand/<asset>.png` and `misc/<asset>.png`

The initial project rows store R2 keys such as `projects/awarely.png` in D1. The public portfolio reads its project list from the API; project images, profile photos, and tech icons load through the API's private R2 binding at `/media/<key>`. Content and auth migrations are applied through Alchemy's D1 resource during deployment. Admin creation is automatic on the first allowlisted Google login; there is no seed-admin command.

## Workspace commands

- `pnpm alchemy:profile:edit` - configure the Cloudflare provider profile for Alchemy.
- `pnpm cf:deploy:plan` - preview the production Cloudflare deployment.
- `pnpm cf:deploy` - deploy the production website, API, D1, and R2 resources.
- `pnpm cf:login` - authenticate Wrangler before uploading production media.

- `pnpm dev` — run the web app and local API.
- `pnpm build` — build all workspace packages with Turbo.
- `pnpm lint` — lint all workspace packages.
- `pnpm db:migrate:local` — apply checked-in migrations to local D1 only.
- `pnpm media:upload:local` — upload public raster images to local R2.
- `pnpm media:upload` — upload public raster images to production R2.

See [Better Auth Google OAuth](https://better-auth.com/docs/authentication/google), [Alchemy custom domains](https://alchemy.run/cloudflare/networking/custom-domains/), and [Cloudflare local data](https://developers.cloudflare.com/workers/local-development/local-data/).
