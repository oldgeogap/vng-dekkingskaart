import { CoverageFile, db } from ".";

export async function addCoverageFile(file: CoverageFile) {
  const dbResult = await db.coveragefile.add(file);
  return dbResult;
}

export async function updateCoverageFile(id: number, file: Partial<CoverageFile>) {
  const dbResult = await db.coveragefile.update(id, file);
  return dbResult;
}
