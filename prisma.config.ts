import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI (migrate, seed) reads DATABASE_URL from .env in the project root.
// Run "npm run db:migrate" from the project root so .env is loaded.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/finances_app";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
