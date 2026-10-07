import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apiDirectory = resolve(root, "apps/api");
const publicDirectory = resolve(root, "apps/web/public");
const local = process.argv.includes("--local");
const bucket = local ? "alfanso-cms-media-local" : "alfanso-cms-media";
const wrangler = resolve(apiDirectory, "node_modules/wrangler/bin/wrangler.js");
const imageKeys = {
  "awarely.png": "projects/awarely.png",
  "carrots.png": "projects/carrots-my-way-home.png",
  "chatify.png": "projects/chatify.png",
  "cloudinary.png": "tech-stack/cloudinary.png",
  "csharp.png": "tech-stack/csharp.png",
  "docker.png": "tech-stack/docker.png",
  "elysia.png": "tech-stack/elysia.png",
  "gloomshine.png": "projects/gloomshine-defense.png",
  "me1.png": "profile/about-01.png",
  "me2.png": "profile/about-02.png",
  "me3.png": "profile/about-03.png",
  "me4.png": "profile/about-04.png",
  "mongodb.png": "tech-stack/mongodb.png",
  "nextjs.png": "tech-stack/nextjs.png",
  "node.png": "tech-stack/node.png",
  "oldtown.png": "misc/oldtown.png",
  "onedeepquestion.png": "projects/one-deep-question.png",
  "profile.jpg": "profile/passport.jpg",
  "react.png": "tech-stack/react.png",
  "rensa.png": "projects/rensa.png",
  "ruins.png": "projects/ruins-of-arthamerta.png",
  "rupan.png": "projects/rupan.png",
  "tailwind.png": "tech-stack/tailwind.png",
  "tedx.png": "projects/tedx-universitas-brawijaya.png",
  "tmt.jpg": "projects/too-many-tasks.jpg",
  "trivquiz.png": "projects/triv-quiz.png",
  "typescript.png": "tech-stack/typescript.png",
  "unity.png": "tech-stack/unity.png",
  "urlicon.png": "brand/favicon.png",
};
const contentTypes = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
};
const rasterImagePattern = /\.(?:png|jpe?g|webp|gif|avif)$/i;
const files = readdirSync(publicDirectory).filter((file) =>
  rasterImagePattern.test(file)
);

if (
  files.length !== Object.keys(imageKeys).length ||
  files.some((file) => !imageKeys[file])
) {
  throw new Error(
    "The public image manifest must list every raster image before upload."
  );
}

for (const file of files) {
  const source = resolve(publicDirectory, file);
  if (!statSync(source).isFile()) {
    throw new Error(`Expected a public image file: ${file}`);
  }
}

const modeArgs = [local ? "--local" : "--remote"];

function runWrangler(args) {
  try {
    execFileSync(
      process.execPath,
      [wrangler, "--config", "wrangler.jsonc", ...args],
      { cwd: apiDirectory, stdio: "inherit" }
    );
  } catch {
    process.exit(1);
  }
}

if (!local) {
  runWrangler(["whoami"]);
}

for (const file of files) {
  const source = resolve(publicDirectory, file);
  const key = imageKeys[file];
  const contentType = contentTypes[extname(file).toLowerCase()];

  if (!contentType) {
    throw new Error(`Unsupported public image format: ${file}`);
  }

  runWrangler([
    "r2",
    "object",
    "put",
    `${bucket}/${key}`,
    `--file=${source}`,
    `--content-type=${contentType}`,
    ...modeArgs,
  ]);
}

console.info(`Uploaded ${files.length} images to ${bucket}.`);
