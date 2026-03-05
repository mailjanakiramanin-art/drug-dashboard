import { NextRequest, NextResponse } from "next/server"
import { listPrograms } from "@/services/ProgramService"

export async function GET(req:NextRequest){
  try {
    const phase = req.nextUrl.searchParams.get("phase")
    const area = req.nextUrl.searchParams.get("area")

    const programs = await listPrograms({
      phase,
      therapeuticArea: area,
    })

    return NextResponse.json(programs)
  } catch (err) {
    console.error("GET /api/programs failed", err)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}