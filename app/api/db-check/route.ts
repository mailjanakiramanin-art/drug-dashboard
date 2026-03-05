import { NextResponse } from "next/server";
import { db } from "../../lib/prisma";

export async function GET() {
  try {
    // Raw query to confirm DB connection
    await db.$queryRaw`SELECT 1`;

    // Fetch counts from all three models
    const [programCount, studyCount, milestoneCount] = await Promise.all([
      db.program.count(),
      db.study.count(),
      db.milestone.count(),
    ]);

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      counts: {
        programs: programCount,
        studies: studyCount,
        milestones: milestoneCount,
      },
    });
  } catch (error) {
    console.error("DB connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}