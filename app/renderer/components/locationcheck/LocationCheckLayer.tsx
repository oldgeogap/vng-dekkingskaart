import * as React from "react";
import { useLocationCheck } from "./LocationCheckProvider";
import { Layer, Feature, Marker } from "react-mapbox-gl";
import { useAppState } from "../provider/AppStateProvider";
import { styled } from "renderer/ui/theme";

export interface LocationCheckLayerProps {}

export function LocationCheckLayer({}: LocationCheckLayerProps) {
  const { pointSelection } = useAppState();
  const { hover } = useLocationCheck();

  return (
    <>
      <Layer
        type="circle"
        paint={{
          "circle-color": "transparent",
          "circle-stroke-color": "#004d40",
          "circle-stroke-width": 3,
          "circle-radius": 4
        }}
      >
        {pointSelection.map((point, i) => (
          <Feature coordinates={[point.x, point.y]} key={i} />
        ))}
      </Layer>
      {hover && (
        <Marker coordinates={[hover.x, hover.y]} anchor="center" style={{ width: "21px", height: "21px" }}>
          <MyMarker />
        </Marker>
      )}
    </>
  );
}

const MyMarker = styled.div`
  width: 20px;
  height: 20px;
  border: 6px solid red;
  border-radius: 50%;

  opacity: 0.6;
`;
