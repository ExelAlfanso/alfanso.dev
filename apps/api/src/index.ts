import {
  type ProjectCategory,
  type ProjectWorkType,
  project,
} from "@alfanso/db/schema";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { createAuth } from "./auth";
import { type Env, getTrustedOrigins } from "./env";

const app = new Hono<{ Bindings: Env }>();
const categories = [
  "APP DEVELOPMENT",
  "GAME DEVELOPMENT",
  "WEB DEVELOPMENT",
] as const satisfies readonly ProjectCategory[];
const workTypes = [
  "PERSONAL",
  "COLLABORATIVE",
] as const satisfies readonly ProjectWorkType[];
const mediaKeyPattern =
  /^(projects|profile|tech-stack|brand|misc)\/[a-z0-9-]+\.(png|jpg)$/;
const projectInput = z.object({
  categories: z.array(z.string().trim().min(1).max(80)).max(30),
  category: z.enum(categories),
  description: z.string().trim().min(1).max(10_000),
  href: z.string().trim().min(1).max(2048),
  img: z
    .string()
    .trim()
    .regex(/^projects\/[a-z0-9-]+\.(png|jpg)$/),
  name: z.string().trim().min(1).max(160),
  workType: z.enum(workTypes),
});

app.use(
  "/api/*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    origin: (origin, context) =>
      getTrustedOrigins(context.env).includes(origin) ? origin : "",
  })
);

app.all("/api/auth/*", (context) =>
  createAuth(context.env).handler(context.req.raw)
);

app.get("/media/*", async (context) => {
  const key = context.req.path.slice("/media/".length);
  if (!mediaKeyPattern.test(key)) {
    return context.json({ error: "Invalid media key" }, 400);
  }

  const object = await context.env.MEDIA.get(key);
  if (!object) {
    return context.notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set(
    "cache-control",
    "public, max-age=86400, stale-while-revalidate=604800"
  );

  return new Response(object.body, { headers });
});

app.get("/api/cms/projects", async (context) => {
  const db = drizzle(context.env.DB);
  const projects = await db
    .select()
    .from(project)
    .orderBy(desc(project.createdAt));

  return context.json({ projects });
});

async function requireAdmin(
  context: Context<{ Bindings: Env }>
): Promise<Response | undefined> {
  const origin = context.req.header("origin");
  if (!(origin && getTrustedOrigins(context.env).includes(origin))) {
    return context.json({ error: "Untrusted origin" }, 403);
  }

  const session = await createAuth(context.env).api.getSession({
    headers: context.req.raw.headers,
  });

  if (!session) {
    return context.json({ error: "Authentication required" }, 401);
  }

  if (!("role" in session.user) || session.user.role !== "admin") {
    return context.json({ error: "Admin role required" }, 403);
  }

  return undefined;
}

app.post("/api/cms/projects", async (context) => {
  const denied = await requireAdmin(context);
  if (denied) {
    return denied;
  }

  const payload: unknown = await context.req.json().catch(() => undefined);
  const parsed = projectInput.safeParse(payload);
  if (!parsed.success) {
    return context.json(
      { error: "Invalid project", issues: parsed.error.issues },
      400
    );
  }

  const now = new Date();
  const db = drizzle(context.env.DB);
  const [created] = await db
    .insert(project)
    .values({ ...parsed.data, createdAt: now, updatedAt: now })
    .returning();

  return context.json(created, 201);
});

app.put("/api/cms/projects/:id", async (context) => {
  const denied = await requireAdmin(context);
  if (denied) {
    return denied;
  }

  const payload: unknown = await context.req.json().catch(() => undefined);
  const parsed = projectInput.safeParse(payload);
  if (!parsed.success) {
    return context.json(
      { error: "Invalid project", issues: parsed.error.issues },
      400
    );
  }

  const db = drizzle(context.env.DB);
  const [updated] = await db
    .update(project)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(project.id, context.req.param("id")))
    .returning();

  if (!updated) {
    return context.json({ error: "Project not found" }, 404);
  }
  return context.json(updated);
});

app.delete("/api/cms/projects/:id", async (context) => {
  const denied = await requireAdmin(context);
  if (denied) {
    return denied;
  }

  const db = drizzle(context.env.DB);
  const [deleted] = await db
    .delete(project)
    .where(eq(project.id, context.req.param("id")))
    .returning({ id: project.id });

  if (!deleted) {
    return context.json({ error: "Project not found" }, 404);
  }
  return context.json(deleted);
});

app.notFound((context) => context.json({ error: "Not found" }, 404));

export default app;
