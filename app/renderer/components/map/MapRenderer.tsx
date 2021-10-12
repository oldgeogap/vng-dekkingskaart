import * as React from "react";
import ReactMapboxGl, { Layer, Feature, ScaleControl, ZoomControl, RotationControl, MapContext } from "react-mapbox-gl";
import { styled } from "renderer/ui/theme";

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BhdGlhbHgiLCJhIjoiY2t0Y21ncjhuMHZ2aDJ2bXlwYjZnNXkxaCJ9.dFShNUjOCOx3Gj5fMWJURw";

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
});

export interface MapRendererProps {
  fitBounds?: [[number, number], [number, number]];
  children: any;
}

export function MapRenderer({ fitBounds, children }: MapRendererProps) {
  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        width: "100%",
        height: "100%"
      }}
      fitBounds={fitBounds}
      fitBoundsOptions={{
        padding: 20
      }}
    >
      {children}
      <ScaleControl />
      <ZoomControl />
      <RotationControl style={{ top: 80 }} />
    </Map>
  );
}

export function useMap() {
  const context = React.useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}
