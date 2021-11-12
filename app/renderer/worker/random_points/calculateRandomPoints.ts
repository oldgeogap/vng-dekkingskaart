import { Feature, MultiPolygon, Point, Polygon } from "@turf/helpers";
import { LocationPoint } from "renderer/types";
import * as turf from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

import { getMunicipalityShapes, getWorkarea } from "../util";

export type CalculateRandomPointsParams = {
  count: number;
  municipalityIds: string[];
};

export type CalculateRandomPointsResult = {
  points: LocationPoint[];
};

export async function calculateRandomPoints({ count, municipalityIds }: CalculateRandomPointsParams) {
  const _MAX_TRIES = count * 100;
  //return variables;
  let points: LocationPoint[] = [];

  if (municipalityIds && municipalityIds.length > 0) {
    let municipalityShapes = await getMunicipalityShapes(municipalityIds);

    let workArea = getWorkarea(municipalityShapes);

    var bbox = turf.bbox(workArea);

    for (let i = 0; i < _MAX_TRIES; i++) {
      let fc = turf.randomPoint(1, { bbox });
      let point = fc.features[0];
      if (matchesConstraints(point, workArea)) {
        points.push({
          x: point.geometry.coordinates[0],
          y: point.geometry.coordinates[1]
        });
      }
      if (points.length >= count) {
        break;
      }
    }
  } else {
    let fc = turf.randomPoint(count, { bbox: [3.3, 50.75, 7.23, 53.58] });
    points = fc.features.map((point) => ({ x: point.geometry.coordinates[0], y: point.geometry.coordinates[1] }));
  }

  return {
    points
  };
}

function matchesConstraints(point: Feature<Point>, shape: Feature<MultiPolygon | Polygon>): boolean {
  return booleanPointInPolygon(point, shape);
}
