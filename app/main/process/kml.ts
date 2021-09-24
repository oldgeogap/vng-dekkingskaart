import togeojson from "@mapbox/togeojson";
import { DOMParser } from "xmldom";
import fs from "fs-extra";

export async function processKML(path: string, targetFile: string) {
  var kml = new DOMParser().parseFromString(fs.readFileSync(path, "utf8"));

  var converted = togeojson.kml(kml);

  await fs.outputFile(targetFile, JSON.stringify(converted, null, '  '));

  return targetFile;
}
