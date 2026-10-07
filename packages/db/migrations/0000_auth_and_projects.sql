CREATE TABLE `user` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL UNIQUE,
  `emailVerified` integer NOT NULL DEFAULT 0,
  `image` text,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL,
  `role` text NOT NULL DEFAULT 'user',
  `banned` integer NOT NULL DEFAULT 0,
  `banReason` text,
  `banExpires` integer
);

CREATE TABLE `session` (
  `id` text PRIMARY KEY NOT NULL,
  `expiresAt` integer NOT NULL,
  `token` text NOT NULL UNIQUE,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL,
  `ipAddress` text,
  `userAgent` text,
  `userId` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `impersonatedBy` text
);

CREATE INDEX `session_userId_idx` ON `session` (`userId`);

CREATE TABLE `account` (
  `id` text PRIMARY KEY NOT NULL,
  `accountId` text NOT NULL,
  `providerId` text NOT NULL,
  `userId` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` integer,
  `refreshTokenExpiresAt` integer,
  `scope` text,
  `password` text,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL
);

CREATE UNIQUE INDEX `account_provider_account_unique`
  ON `account` (`providerId`, `accountId`);
CREATE INDEX `account_userId_idx` ON `account` (`userId`);

CREATE TABLE `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expiresAt` integer NOT NULL,
  `createdAt` integer,
  `updatedAt` integer
);

CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);

CREATE TABLE `project` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `img` text NOT NULL,
  `category` text NOT NULL CHECK (`category` IN ('APP DEVELOPMENT', 'GAME DEVELOPMENT', 'WEB DEVELOPMENT')),
  `description` text NOT NULL,
  `href` text NOT NULL,
  `categories` text NOT NULL DEFAULT '[]' CHECK (json_valid(`categories`)),
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL
);
