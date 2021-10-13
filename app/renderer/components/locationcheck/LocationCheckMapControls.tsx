import * as React from "react";
import { MapControlDragPoint } from "../map/MapControlDragPoint";
import { useLocationCheck } from "./LocationCheckProvider";

export interface LocationCheckMapControlsProps {}

export function LocationCheckMapControls({}: LocationCheckMapControlsProps) {
  const { setPreset } = useLocationCheck();
  return (
    <>
      <MapControlDragPoint
        onDragEnd={(x, y) => {
          setPreset({ x, y });
        }}
      />
    </>
  );
}
