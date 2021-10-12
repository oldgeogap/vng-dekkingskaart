import fs from "fs";
import * as turf from "@turf/turf";
import { Feature, Polygon, MultiPolygon } from "@turf/turf";
import booleanIntersects from "@turf/boolean-intersects";
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
  let municipalityShapes: Feature<MultiPolygon>[] = [];
  let coverageShape: any = null;
  let coveragePercent = 0;

  //read input
  let coverageString = fs.readFileSync(coverageFilePath, "utf8");
  let coverageJSON = JSON.parse(coverageString);
  let muniJSON = await fetch("/data/gemeenten.geojson").then((res) => res.json());

  let totalMunicipalities = municipalityIds.length;

  for (let i = 0, n = muniJSON.features.length; i < n; i++) {
    if (municipalityIds.includes(muniJSON.features[i].properties.code)) {
      municipalityShapes.push(muniJSON.features[i]);
    }
    if (municipalityShapes.length === totalMunicipalities) {
      break;
    }
  }
  let workArea: Feature<MultiPolygon | Polygon>;
  if (totalMunicipalities >= 2) {
    workArea = turf.union(municipalityShapes[0], municipalityShapes[1]);
    if (totalMunicipalities > 2) {
      for (let i = 2, n = totalMunicipalities; i < n; i++) {
        workArea = turf.union(workArea, municipalityShapes[i]);
      }
    }
  } else {
    workArea = municipalityShapes[0];
  }

  let bbox = turf.bbox(workArea);
  let bboxPolygon = turf.bboxPolygon(bbox);

  let coverageFeatures: Feature<Polygon>[] = [];
  coverageJSON.features.forEach((feature) => {
    if (booleanIntersects(bboxPolygon, feature)) {
      coverageFeatures.push(feature);
    }
  });

  let fc = turf.combine(turf.featureCollection(coverageFeatures));
  let coverageFeaturesCombined = fc.features[0] as Feature<MultiPolygon>;
  coverageShape = turf.intersect(coverageFeaturesCombined, workArea);

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
