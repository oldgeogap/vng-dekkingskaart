import fs from "fs";
import * as turf from "@turf/turf";
import { Feature, Polygon, Point, MultiPolygon } from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import { LocationPoint } from "renderer/types";

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
  coverageShape: Feature<MultiPolygon>;
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
  let bbox = turf.bbox(turf.featureCollection(coveragePoints.map((p) => p.point)));
  let bboxPolygon = turf.buffer(turf.bboxPolygon(bbox), 0.2);

  let coverageFeatures: Feature<Polygon>[] = [];
  coverageJSON.features.forEach((feature) => {
    if (booleanIntersects(bboxPolygon, feature)) {
      coverageFeatures.push(feature);
    }
    coveragePoints.forEach((p) => {
      if (booleanPointInPolygon(p.point, feature)) {
        p.hasCoverage = true;
      }
    });
  });
  let fc = turf.combine(turf.featureCollection(coverageFeatures));
  let coverageShape = fc.features[0] as Feature<MultiPolygon>;
  return {
    id,
    points: coveragePoints.map((p) => ({
      x: p.point.geometry.coordinates[0],
      y: p.point.geometry.coordinates[1],
      hasCoverage: p.hasCoverage
    })),
    coverageShape
  };
}
