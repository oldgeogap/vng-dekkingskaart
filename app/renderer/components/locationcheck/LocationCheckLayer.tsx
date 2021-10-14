import * as React from "react";
import { useLocationCheck } from "./LocationCheckProvider";
import { Layer, Feature } from "react-mapbox-gl";

export interface LocationCheckLayerProps {}

export function LocationCheckLayer({}: LocationCheckLayerProps) {
  const { points } = useLocationCheck();

  return (
    <Layer
      type="circle"
      paint={{
        "circle-color": "transparent",
        "circle-stroke-color": "#004d40",
        "circle-stroke-width": 3,
        "circle-radius": 4
      }}
    >
      {points.map((point, i) => (
        <Feature coordinates={[point.x, point.y]} key={i} />
      ))}
    </Layer>
  );
}
