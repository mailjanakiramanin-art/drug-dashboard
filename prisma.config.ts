import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("app/prisma", "schema.prisma"),

  migrations: {
    path: path.join("app/prisma", "migrations"),
    seed: "npx ts-node app/prisma/seed.ts",
  },

  // ✨ Moved connection URL into config
  datasource: {
    url: env("DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"), // optional
  },
});