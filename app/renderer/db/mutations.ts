import { CoverageFile, db } from ".";

export async function addCoverageFile(file: CoverageFile) {
  const dbResult = await db.coveragefile.add(file);
  return dbResult;
}

export async function updateCoverageFile(id: number, file: Partial<CoverageFile>) {
  try {
    const dbResult = await db.coveragefile.update(id, file);
    if (dbResult) return true;
    return false;
  } catch (err) {
    return false;
  }
}
