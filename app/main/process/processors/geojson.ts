import fs from "fs-extra";

export async function processGeoJSON(path: string, targetFile: string) {
  var src = fs.readFileSync(path, "utf8");

  //do some processing maybe

  await fs.outputFile(targetFile, src);

  return targetFile;
}
