import togeojson from "@mapbox/togeojson";
import { DOMParser } from "xmldom";
import fs from "fs-extra";
import { postProcessGeoJSON } from "./geojson";

export async function processKML(path: string, targetFile: string) {
  var kml = new DOMParser().parseFromString(fs.readFileSync(path, "utf8"));

  var converted = togeojson.kml(kml);

  let stats = await postProcessGeoJSON(targetFile, converted);

  return { targetFile, stats };
}
