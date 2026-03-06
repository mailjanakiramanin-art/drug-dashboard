import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Constants ──────────────────────────────────────────────
const PHASES = ["Phase I", "Phase II", "Phase III", "Phase IV"];
const STATUSES = ["Active", "On Hold", "Completed", "Terminated"];
const THERAPEUTIC_AREAS = [
  "Oncology", "Cardiology", "Neurology",
  "Immunology", "Rare Diseases", "Infectious Diseases",
];
const MILESTONE_STATUSES = ["Pending", "In Progress", "Completed", "Delayed"];

const TOTAL_PROGRAMS = 1000;
const BATCH_SIZE = 100;

// ── Helpers ────────────────────────────────────────────────
const randomFrom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ── Seed ───────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding database...");
  console.time("⏱ Seed duration");

  // Clear existing data in correct order
  await prisma.milestone.deleteMany();
  await prisma.study.deleteMany();
  await prisma.program.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑  Cleared existing data");

  // Create test users with different roles
  const hashedPasswordViewer = await bcryptjs.hash("password123", 10);
  const hashedPasswordEditor = await bcryptjs.hash("password123", 10);
  const hashedPasswordAdmin = await bcryptjs.hash("password123", 10);

  const testUsers = await prisma.user.createMany({
    data: [
      {
        id: faker.string.uuid(),
        email: "viewer@example.com",
        name: "Viewer User",
        password: hashedPasswordViewer,
        role: "VIEWER",
      },
      {
        id: faker.string.uuid(),
        email: "editor@example.com",
        name: "Editor User",
        password: hashedPasswordEditor,
        role: "EDITOR",
      },
      {
        id: faker.string.uuid(),
        email: "admin@example.com",
        name: "Admin User",
        password: hashedPasswordAdmin,
        role: "ADMIN",
      },
    ],
  });

  console.log("👥 Created test users:");
  console.log("   Email: viewer@example.com (Password: password123) - VIEWER role");
  console.log("   Email: editor@example.com (Password: password123) - EDITOR role");
  console.log("   Email: admin@example.com (Password: password123) - ADMIN role");


  let totalStudies = 0;
  let totalMilestones = 0;

  for (let batch = 0; batch < TOTAL_PROGRAMS / BATCH_SIZE; batch++) {
    // FIX: Generate IDs manually to ensure they are available for relations
    // Also ensuring all potentially required fields are present
    const programData = Array.from({ length: BATCH_SIZE }, () => {
      const name = `${faker.science.chemicalElement().name}-${faker.string.alphanumeric(4).toUpperCase()}`;
      return {
        id: faker.string.uuid(), // Explicitly provide ID to avoid null constraints on relations
        name: name,
        // slug: faker.helpers.slugify(name).toLowerCase(), // Uncomment if your schema has a slug
        therapeuticArea: randomFrom(THERAPEUTIC_AREAS),
        phase: randomFrom(PHASES),
        status: randomFrom(STATUSES),
        description: faker.lorem.sentences(2),
        createdAt: new Date(),
        // updatedAt: new Date(),
      };
    });

    // Batch insert programs
    await prisma.program.createMany({ data: programData });

    // Build studies + milestones using the IDs we just generated
    const studies = programData.flatMap((prog) =>
      Array.from({ length: randomBetween(3, 5) }, () => {
        const target = randomBetween(100, 500);
        return {
          id: faker.string.uuid(),
          name: `${faker.string.alpha({ length: 3, casing: "upper" })}-${faker.string.numeric(4)}`,
          phase: randomFrom(PHASES),
          targetEnrollment: target,
          currentEnrollment: randomBetween(0, target),
          programId: prog.id, // Linked to program ID
        };
      })
    );

    const milestones = programData.flatMap((prog) =>
      Array.from({ length: randomBetween(2, 4) }, () => {
        const targetDate = faker.date.between({
          from: "2023-01-01",
          to: "2026-12-31",
        });
        const isCompleted = Math.random() > 0.5;
        return {
          id: faker.string.uuid(),
          title: faker.helpers.arrayElement([
            "IND Submission", "Phase Initiation", "Interim Analysis",
            "Final Report", "Regulatory Approval", "Data Lock", "NDA Submission",
          ]),
          status: randomFrom(MILESTONE_STATUSES),
          targetDate,
          // completedDate: isCompleted
          //   ? faker.date.between({ from: "2023-01-01", to: targetDate })
          //   : null,
          programId: prog.id,
        };
      })
    );

    await prisma.study.createMany({ data: studies });
    await prisma.milestone.createMany({ data: milestones });

    totalStudies += studies.length;
    totalMilestones += milestones.length;

    console.log(
      `✅ Batch ${batch + 1}/${TOTAL_PROGRAMS / BATCH_SIZE} — ` +
      `${(batch + 1) * BATCH_SIZE} programs inserted`
    );
  }

  console.log("\n📊 Seed Summary:");
  console.log(`   Programs   : ${TOTAL_PROGRAMS}`);
  console.log(`   Studies    : ${totalStudies}`);
  console.log(`   Milestones : ${totalMilestones}`);
  console.timeEnd("⏱ Seed duration");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
