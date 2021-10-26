import * as React from "react";
import { useMap } from "./MapRenderer";
import * as mapboxgl from "mapbox-gl";

export interface MapBoundsProps {
  points: [number, number][];
}

export function MapBounds({ points }: MapBoundsProps) {
  const map = useMap();

  React.useEffect(() => {
    if (points && points.length) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((point) => bounds.extend(point));
      map.fitBounds(bounds, { padding: 100 });
    }
  }, [points]);
  return null;
}
