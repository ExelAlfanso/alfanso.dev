ALTER TABLE `project`
  ADD COLUMN `workType` text NOT NULL DEFAULT 'PERSONAL'
  CHECK (`workType` IN ('PERSONAL', 'COLLABORATIVE'));

INSERT INTO `project` (
  `id`, `name`, `img`, `workType`, `category`, `description`, `href`,
  `categories`, `createdAt`, `updatedAt`
) VALUES
  (
    'awarely', 'Awarely', 'projects/awarely.png', 'PERSONAL',
    'WEB DEVELOPMENT',
    'Awarely is a website that focuses on counseling, reporting, and social justice for college students in FILKOM UB. Built with React.js and Node.js (Express).',
    'https://awarely-five.vercel.app/', '["React.JS","Express.js"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 14000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 14000
  ),
  (
    'chatify', 'Chatify', 'projects/chatify.png', 'PERSONAL',
    'WEB DEVELOPMENT',
    'Chatify is a real-time chat application built with React.js for the frontend and MongoDB for the backend, allowing users to send messages instantly.',
    'https://chatify-roan.vercel.app/',
    '["React.JS","Next.JS","MongoDB","Socket.io"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 13000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 13000
  ),
  (
    'trivquiz', 'TrivQuiz', 'projects/triv-quiz.png', 'PERSONAL',
    'WEB DEVELOPMENT',
    'TrivQuiz is a fun and interactive quiz application that tests your knowledge across various topics, built using React.js. This is my mini project for DOT Indonesia Internship 2025 application.',
    'https://triv-quiz-app.vercel.app/', '["React.JS","UI/UX"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 12000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 12000
  ),
  (
    'one-deep-question', 'One Deep Question',
    'projects/one-deep-question.png', 'PERSONAL', 'WEB DEVELOPMENT',
    'One Deep Question is a reflective web product centered on a single shared daily prompt. Every user sees the same question on a given date. Users can submit one public response per browser per day, either anonymously or under a custom display name, and read other responses in a calm, reading-first interface.',
    'https://one-deep-question.alfanso.dev/',
    '["Next.JS","PostgreSQL","Drizzle"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 11000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 11000
  ),
  (
    'carrots-my-way-home', 'Carrots My Way Home',
    'projects/carrots-my-way-home.png', 'COLLABORATIVE',
    'GAME DEVELOPMENT',
    'Carrots My Way Home is a game about a rabbit that wants to go home by collecting carrots along the way.',
    'https://exelcoeg.itch.io/carrots-my-way-home', '["Unity","C#"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 10000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 10000
  ),
  (
    'gloomshine-defense', 'Gloomshine Defense',
    'projects/gloomshine-defense.png', 'COLLABORATIVE',
    'GAME DEVELOPMENT',
    'Gloomshine Defense is a tower defense game set in a fantasy world full of mysterious creatures and challenging levels. Project for IGDX Bootcamp 2023.',
    'https://ohm195.itch.io/gloomshine-defense', '["Unity","C#"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 9000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 9000
  ),
  (
    'rensa', 'Rensa', 'projects/rensa.png', 'COLLABORATIVE',
    'WEB DEVELOPMENT',
    'Rensa is a web application that allows users to share photos with their settings and connect with others.',
    'https://rensa.site',
    '["React.JS","MongoDB","Next.JS","Express.JS","Cloudinary"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 8000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 8000
  ),
  (
    'tedx-universitas-brawijaya', 'TedXUniversitasBrawijaya',
    'projects/tedx-universitas-brawijaya.png', 'COLLABORATIVE',
    'WEB DEVELOPMENT',
    'Rensa is a web application that allows users to share photos with their settings and connect with others.',
    'https://tedxuniversitasbrawijaya.com',
    '["React.JS","tRPC","Astro","HTML","CSS","Cloudflare"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 7000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 7000
  ),
  (
    'rupan', 'Rupan', 'projects/rupan.png', 'COLLABORATIVE',
    'GAME DEVELOPMENT',
    'Rupan is a Brackeys Game Jam submission themed ''Calm Before the Storm''.',
    'https://exelcoeg.itch.io/rupan', '["Unity","C#"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 6000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 6000
  ),
  (
    'too-many-tasks', 'Too Many Tasks',
    'projects/too-many-tasks.jpg', 'COLLABORATIVE',
    'GAME DEVELOPMENT',
    'Too Many Tasks is a multi-tasking game where we operate multiple parts of a job all at once. This game is currently in progress for the GameSeed 2024 GameJam.',
    'https://nanta-adji.itch.io/110-raionexe-student-too-many-tasks',
    '["Unity","C#"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 5000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 5000
  ),
  (
    'ruins-of-arthamerta', 'Ruins of Arthamerta',
    'projects/ruins-of-arthamerta.png', 'COLLABORATIVE',
    'GAME DEVELOPMENT',
    'Ruins of Arthamerta is a 2D action adventure game set in a fantasy world inspired by Indonesian mythology.',
    'https://exelcoeg.itch.io/ruins-of-arthamerta', '["Unity","C#"]',
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 4000,
    CAST(strftime('%s','now') AS INTEGER) * 1000 + 4000
  )
ON CONFLICT(`id`) DO UPDATE SET
  `name` = excluded.`name`,
  `img` = excluded.`img`,
  `workType` = excluded.`workType`,
  `category` = excluded.`category`,
  `description` = excluded.`description`,
  `href` = excluded.`href`,
  `categories` = excluded.`categories`,
  `updatedAt` = excluded.`updatedAt`;
