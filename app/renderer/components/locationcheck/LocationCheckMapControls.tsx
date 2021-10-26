import * as React from "react";
import { MapControlDragPoint } from "../map/MapControlDragPoint";
import { useLocationCheck } from "./LocationCheckProvider";

export interface LocationCheckMapControlsProps {}

export function LocationCheckMapControls({}: LocationCheckMapControlsProps) {
  const { setPreset } = useLocationCheck();
  return (
    <>
      <MapControlDragPoint
        y={64}
        onDragEnd={(x, y) => {
          setPreset({ x, y });
        }}
      />
    </>
  );
}
