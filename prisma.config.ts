import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: "prisma/migrations",
    // Integrated seeding functionality expects this key
    seed: "npx ts-node ./prisma/seed.ts", 
  },
  migrate: {
    migrationsDir: path.join("prisma", "migrations"),
    seed: {
      run: "npx ts-node prisma/seed.ts",
    },
    async adapter() {
      const { Pool } = await import("pg");
      const { PrismaPg } = await import("@prisma/adapter-pg");

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      return new PrismaPg(pool);
    },
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});