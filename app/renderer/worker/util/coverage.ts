import fs from "fs";

export function getCoverageShape(path: string) {
  let coverageString = fs.readFileSync(path, "utf8");
  let coverageJSON = JSON.parse(coverageString);
  let coverageDonutsJSON = null;

  let donutPath = path.replace(".geojson", ".donuts.geojson");
  if (fs.existsSync(donutPath)) {
    let coverageDonutsString = fs.readFileSync(donutPath, "utf8");
    coverageDonutsJSON = JSON.parse(coverageDonutsString);
  }

  return [coverageJSON, coverageDonutsJSON];
}
