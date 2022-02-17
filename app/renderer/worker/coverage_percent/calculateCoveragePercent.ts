import fs from "fs";
import * as turf from "@turf/turf";
import { Feature, Polygon, MultiPolygon } from "@turf/turf";
import booleanIntersects from "@turf/boolean-intersects";
import { getMunicipalityShapes, getWorkarea } from "../util";
import { logToFile } from "../util/log";
export type CoveragePercentArguments = {
  id: string;
  coverageFilePath: string;
  municipalityIds: string[];
};

export type CoveragePercentResult = {
  id: string;
  coverageShape: Feature<MultiPolygon>;
  municipalityShapes: Feature<MultiPolygon>[];
  coveragePercent: number;
};

export async function calculateCoveragePercent({
  id,
  coverageFilePath,
  municipalityIds
}: CoveragePercentArguments): Promise<CoveragePercentResult> {
  //result variables
  let municipalityShapes = await getMunicipalityShapes(municipalityIds);
  //logToFile(municipalityShapes, "muni", "geojson");
  let coverageShape: any = null;
  let coveragePercent = 0;

  //read input
  let coverageString = fs.readFileSync(coverageFilePath, "utf8");
  let coverageJSON = JSON.parse(coverageString);
  let workArea = getWorkarea(municipalityShapes);

  let bbox = turf.bbox(workArea);
  let bboxPolygon = turf.bboxPolygon(bbox);

  let coverageFeatures: Feature<Polygon>[] = [];
  coverageJSON.features.forEach((feature) => {
    if (booleanIntersects(bboxPolygon, feature)) {
      coverageFeatures.push(feature);
    }
  });

  let fc = turf.combine(turf.featureCollection(coverageFeatures));

  // logToFile(fc, "combined", "geojson");
  // console.log("Combined count", fc.features.length);
  let coverageFeaturesCombined = fc.features[0] as Feature<MultiPolygon>;

  // logToFile(coverageFeaturesCombined, "coverage", "geojson");
  // logToFile(workArea, "workarea", "geojson");
  coverageShape = turf.intersect(coverageFeaturesCombined, workArea);
  // logToFile(
  //   {
  //     type: "FeatureCollection",
  //     features: [coverageShape]
  //   },
  //   "coverageShape",
  //   "geojson"
  // );
  let coverageArea = turf.area(coverageShape);
  let municipalityArea = turf.area(workArea);
  coveragePercent = (coverageArea / municipalityArea) * 100;

  return {
    id,
    coverageShape,
    municipalityShapes,
    coveragePercent
  };
}
