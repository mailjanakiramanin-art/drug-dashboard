// use the shared prisma client so that the connection options (like DATABASE_URL)
// are applied consistently. The singleton in app/lib/prisma.ts handles the
// adapter and ensures only one client is created during dev hot reload.
import { db } from "../app/lib/prisma"

const prisma = db

export async function getPrograms(filters:any) {
  // build a `where` clause only with defined values; Prisma complains if a
  // required field is explicitly set to `null`.
  const where: any = {}
  if (filters.phase != null) where.phase = filters.phase
  if (filters.therapeuticArea != null) where.therapeuticArea = filters.therapeuticArea

  return prisma.program.findMany({
    where,
    include: {
      studies: true,
    },
    take: 20,
  })
}

export async function getProgramById(id:string) {

  return prisma.program.findUnique({
    where: { id },
    include: {
      studies: true,
      milestones: true
    }
  })

}

export async function updateProgram(id:string,data:any){

  return prisma.program.update({
    where:{ id },
    data
  })

}