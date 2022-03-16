import fs from "fs";
import * as turf from "@turf/turf";
import { Feature, Polygon, MultiPolygon } from "@turf/turf";
import booleanIntersects from "@turf/boolean-intersects";
import { getCoverageShape, getMunicipalityShapes, getWorkarea } from "../util";
import { logToFile } from "../util/log";

export type CoveragePercentArguments = {
  id: string;
  coverageFilePath: string;
  municipalityIds: string[];
};

export type CalcResult = {
  municipalityId: string;
  coverageArea: number;
  municipalityArea: number;
  coveragePercent: number;
};

export type CoveragePercentResult = {
  id: string;
  coverageShapes: Feature<MultiPolygon>[];
  municipalityShapes: Feature<MultiPolygon>[];
  coveragePercent: number;
  calcResult: CalcResult[];
};

export async function calculateCoveragePercent({
  id,
  coverageFilePath,
  municipalityIds
}: CoveragePercentArguments): Promise<CoveragePercentResult> {
  //result variables

  let municipalityShapes = await getMunicipalityShapes(municipalityIds);
  //logToFile(municipalityShapes, "muni", "geojson");

  //read input
  const [coverageJSON, coverageDonutsJSON] = getCoverageShape(coverageFilePath);

  let coverageShapes = [];
  let results: CalcResult[] = [];
  municipalityShapes.forEach((muni, n) => {
    let bbox = turf.bbox(muni);
    let bboxPolygon = turf.bboxPolygon(bbox);

    let coverageFeatures: Feature<Polygon | MultiPolygon>[] = [];
    let coverageDonutFeatures: Feature<Polygon>[] = [];

    coverageJSON.features.forEach((feature) => {
      if (booleanIntersects(bboxPolygon, feature)) {
        coverageFeatures.push(feature);
      }
    });

    if (coverageDonutsJSON) {
      coverageDonutsJSON.features.forEach((feature) => {
        if (booleanIntersects(bboxPolygon, feature)) {
          coverageDonutFeatures.push(feature);
        }
      });
    }

    coverageFeatures.forEach((cf, i) => {
      let coverageShape = cf;
      if (coverageShape) {
        coverageDonutFeatures.forEach((donutFeature) => {
          if (cf.id === donutFeature.properties.id) {
            coverageShape = turf.difference(coverageShape, donutFeature);
          }
        });
        coverageFeatures[i] = coverageShape;
      } else {
        coverageFeatures[i] = null;
      }
    });

    let fc = turf.combine(turf.featureCollection(coverageFeatures.filter((cf) => cf !== null)));
    let coverageShape = fc.features[0] as Feature<MultiPolygon | Polygon>;
    coverageShape = turf.intersect(coverageShape, muni);
    coverageShapes.push(coverageShape);

    let coverageArea = turf.area(coverageShape);
    let municipalityArea = turf.area(muni);
    let coveragePercent = (coverageArea / municipalityArea) * 100;

    results.push({
      municipalityId: municipalityIds[n],
      coverageArea,
      municipalityArea,
      coveragePercent
    });
  });

  let totalCoverageArea = results.reduce((acc, cur) => {
    return acc + cur.coverageArea;
  }, 0);
  let totalMunicipalityArea = results.reduce((acc, cur) => {
    return acc + cur.municipalityArea;
  }, 0);
  let coveragePercent = (totalCoverageArea / totalMunicipalityArea) * 100;

  return {
    id,
    coverageShapes,
    municipalityShapes,
    coveragePercent,
    calcResult: results
  };
}
