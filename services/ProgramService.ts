import * as repo from "../repositories/ProgramRepository"

export async function listPrograms(filters:any){

  return repo.getPrograms(filters)

}

export async function getProgramDetails(id:string){

  return repo.getProgramById(id)

}

export async function updateProgramMetadata(id:string,data:any){

  const updated = await repo.updateProgram(id,data)

  // Future event hook
  // publishProgramUpdatedEvent(updated)

  return updated

}