import { getProgramDetails, updateProgramMetadata } from "@/services/ProgramService"
import { NextResponse, NextRequest } from "next/server"
import { getAuthUser, hasRole } from "@/app/lib/authUtils"

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

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const user = await getAuthUser(req)

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!hasRole(user.role, "EDITOR")) {
      return NextResponse.json(
        { error: "You don't have permission to edit programs" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const updated = await updateProgramMetadata(id, body)
    return NextResponse.json(updated)
  } catch (err) {
    console.error("PATCH /api/programs/[id] failed", err)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
