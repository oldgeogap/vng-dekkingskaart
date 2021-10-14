import fs from "fs";
import * as turf from "@turf/turf";
import { Feature, Polygon, Point } from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { LocationPoint } from "renderer/components/locationcheck/LocationCheckProvider";

type CoveragePoint = {
  point: Feature<Point>;
  hasCoverage: boolean;
};

export type CoveragePointArguments = {
  id: string;
  coverageFilePath: string;
  points: LocationPoint[];
};

export type CoveragePointResult = {
  id: string;
  points: LocationPoint[];
};

export async function calculateCoveragePoint({
  id,
  coverageFilePath,
  points
}: CoveragePointArguments): Promise<CoveragePointResult> {
  //result variables

  let coveragePoints: CoveragePoint[] = points.map((p) => ({
    point: turf.point([p.x, p.y]),
    hasCoverage: false
  }));

  //read input
  let coverageString = fs.readFileSync(coverageFilePath, "utf8");
  let coverageJSON = JSON.parse(coverageString);

  coverageJSON.features.forEach((feature) => {
    coveragePoints.forEach((p) => {
      if (booleanPointInPolygon(p.point, feature)) {
        p.hasCoverage = true;
      }
    });
  });

  return {
    id,
    points: coveragePoints.map((p) => ({
      x: p.point.geometry.coordinates[0],
      y: p.point.geometry.coordinates[1],
      hasCoverage: p.hasCoverage
    }))
  };
}
