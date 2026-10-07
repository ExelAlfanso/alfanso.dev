import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export type ProjectCategory =
  | "APP DEVELOPMENT"
  | "GAME DEVELOPMENT"
  | "WEB DEVELOPMENT";
export type ProjectWorkType = "COLLABORATIVE" | "PERSONAL";

export const user = sqliteTable("user", {
  banExpires: integer("banExpires", { mode: "timestamp_ms" }),
  banned: integer("banned", { mode: "boolean" }).notNull().default(false),
  banReason: text("banReason"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" })
    .notNull()
    .default(false),
  id: text("id").primaryKey(),
  image: text("image"),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

export const session = sqliteTable(
  "session",
  {
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    id: text("id").primaryKey(),
    impersonatedBy: text("impersonatedBy"),
    ipAddress: text("ipAddress"),
    token: text("token").notNull().unique(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = sqliteTable(
  "account",
  {
    accessToken: text("accessToken"),
    accessTokenExpiresAt: integer("accessTokenExpiresAt", {
      mode: "timestamp_ms",
    }),
    accountId: text("accountId").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
    id: text("id").primaryKey(),
    idToken: text("idToken"),
    password: text("password"),
    providerId: text("providerId").notNull(),
    refreshToken: text("refreshToken"),
    refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId
    ),
    index("account_userId_idx").on(table.userId),
  ]
);

export const verification = sqliteTable(
  "verification",
  {
    createdAt: integer("createdAt", { mode: "timestamp_ms" }),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
    value: text("value").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const project = sqliteTable("project", {
  categories: text("categories", { mode: "json" }).$type<string[]>().notNull(),
  category: text("category").$type<ProjectCategory>().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  description: text("description").notNull(),
  href: text("href").notNull(),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  img: text("img").notNull(),
  name: text("name").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
  workType: text("workType").$type<ProjectWorkType>().notNull(),
});

export const authSchema = { account, session, user, verification };
