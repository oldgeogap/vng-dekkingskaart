import { Feature, MultiPolygon, Polygon } from "@turf/helpers";
import * as turf from "@turf/turf";

export function getWorkarea(shapes: Feature<MultiPolygon | Polygon>[]): Feature<MultiPolygon | Polygon> {
  let total = shapes.length;
  let workArea: Feature<MultiPolygon | Polygon>;
  if (total >= 2) {
    workArea = turf.union(shapes[0], shapes[1]);
    if (total > 2) {
      for (let i = 2, n = total; i < n; i++) {
        workArea = turf.union(workArea, shapes[i]);
      }
    }
  } else {
    workArea = shapes[0];
  }

  return workArea;
}
