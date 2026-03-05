import { getProgramDetails, updateProgramMetadata } from "@/services/ProgramService"
import { NextResponse } from "next/server"

export async function GET(req:any,{params}:any){
  try {
    const { id } = await params
    const program = await getProgramDetails(id)
    return NextResponse.json(program)
  } catch (err) {
    console.error("GET /api/programs/[id] failed", err)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}

export async function PATCH(req:any,{params}:any){
  try {
    const { id } = await params
    const body = await req.json()
    const updated = await updateProgramMetadata(id, body)
    return NextResponse.json(updated)
  } catch (err) {
    console.error("PATCH /api/programs/[id] failed", err)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}