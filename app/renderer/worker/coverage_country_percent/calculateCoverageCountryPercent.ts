import { getCountryShape, getCoverageShape } from "../util";
import * as turf from "@turf/turf";
import { Feature, MultiPolygon } from "@turf/turf";
import booleanContains from "@turf/boolean-contains";
import booleanOverlap from "@turf/boolean-overlap";

import booleanIntersects from "@turf/boolean-intersects";
import { logToFile } from "../util/log";
export type CoveragePercentCountryArguments = {
  coverageFilePath: string;
  report?: (report: Report) => void;
};

export type Report = {
  blockSize: number;
  blockCount: number;
  block: number;
  blockDelta: number;
};

export type CoveragePercentCountryResult = {
  coveragePercent: number;
  coverageFilePath: string;
};

export async function calculateCoverageCountryPercent({
  coverageFilePath,
  report
}: CoveragePercentCountryArguments): Promise<CoveragePercentCountryResult> {
  let coveragePercent = 0;

  try {
    const countryShape = await getCountryShape();

    const countryFeature = countryShape.features[0] as Feature<MultiPolygon>;

    const countryArea = countryShape.features[0].properties.area;

    const [coverageShapes, coverageDonutShapes] = getCoverageShape(coverageFilePath);

    let coverageArea = 0;

    let blockSize = 1000;
    let total = coverageShapes.features.length;
    if (coverageDonutShapes) total += coverageDonutShapes.features.length;

    let blockCount = Math.ceil(total / blockSize);
    let startTime = performance.now();
    let block = 1;
    let blockDelta = 0;

    coverageShapes.features.forEach((shape, n) => {
      let section = turf.intersect(countryFeature, shape);
      if (section) {
        coverageArea += turf.area(section);
      }
      let curBlock = Math.ceil(n / blockSize);
      if (curBlock !== block) {
        block = curBlock;
        blockDelta = performance.now() - startTime;
        startTime = performance.now();
        if (report) {
          report({
            blockSize,
            blockCount,
            block,
            blockDelta
          });
        }
      }
    });

    let negativeArea = 0;

    if (coverageDonutShapes) {
      coverageDonutShapes.forEach((donut, n) => {
        if (booleanContains(donut, countryFeature)) {
          negativeArea += turf.area(donut);
        } else if (booleanOverlap(donut, countryFeature)) {
          let insect = turf.intersect(donut, countryFeature);
          negativeArea += turf.area(insect);
        }

        let curBlock = Math.ceil(n / blockSize);
        if (curBlock !== block) {
          block = curBlock;
          blockDelta = performance.now() - startTime;
          startTime = performance.now();
          if (report) {
            report({
              blockSize,
              blockCount,
              block,
              blockDelta
            });
          }
        }
      });
    }

    let area = coverageArea - negativeArea;
    coveragePercent = (area / countryArea) * 100;
  } catch (err) {
    console.error(err);
  }

  return { coveragePercent, coverageFilePath };
}
