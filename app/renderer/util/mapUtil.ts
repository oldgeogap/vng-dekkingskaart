import { FitBounds } from "react-mapbox-gl/lib/map";
import { LocationPoint } from "renderer/types";

export function bboxForPoints(points: LocationPoint[]): FitBounds {
  const minX = points.reduce((min, p) => Math.min(min, p.x), Number.MAX_VALUE);
  const minY = points.reduce((min, p) => Math.min(min, p.y), Number.MAX_VALUE);
  const maxX = points.reduce((max, p) => Math.max(max, p.x), Number.MIN_VALUE);
  const maxY = points.reduce((max, p) => Math.max(max, p.y), Number.MIN_VALUE);
  return [
    [minX, minY],
    [maxX, maxY]
  ];
}
