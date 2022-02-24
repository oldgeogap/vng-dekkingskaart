import fs from "fs";

export function getCoverageShape(path: string, tesselate?: boolean) {
  let coverageString = fs.readFileSync(path, "utf8");
  let coverageJSON = JSON.parse(coverageString);

  return coverageJSON;
}
