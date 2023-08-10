import * as React from "react";
import ReactMapboxGl, { Layer, Feature, ScaleControl, ZoomControl, RotationControl, MapContext } from "react-mapbox-gl";
import { FitBoundsOptions } from "react-mapbox-gl/lib/map";
import { styled } from "renderer/ui/theme";
import { StyleSwitcher } from "./StyleSwitcher";

export const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic3BhdGlhbHgiLCJhIjoiY2t0Y21ncjhuMHZ2aDJ2bXlwYjZnNXkxaCJ9.dFShNUjOCOx3Gj5fMWJURw";

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
});

export type MapStyle = {
  style: string;
  label: string;
};

export const mapStyles: MapStyle[] = [
  {
    style: "mapbox://styles/mapbox/streets-v9",
    label: "standaard"
  },
  {
    style: "/mapstyle/light/style.json",
    label: "licht"
  },
  {
    style: "/mapstyle/satellite/style.json",
    label: "Satelliet"
  }
];

export interface MapRendererProps {
  fitBounds?: [[number, number], [number, number]];
  fitBoundsOptions?: FitBoundsOptions;
  center?: [number, number];
  zoom?: number;
  children: any;
}

export function MapRenderer({ fitBounds, fitBoundsOptions, center, zoom, children }: MapRendererProps) {
  const [mapStyle, setMapStyle] = React.useState<MapStyle>(mapStyles[0]);
  return (
    <Map
      style={mapStyle.style}
      containerStyle={{
        width: "100%",
        height: "100%"
      }}
      fitBounds={fitBounds}
      fitBoundsOptions={
        fitBoundsOptions || {
          padding: 20
        }
      }
      center={center}
      zoom={zoom ? [zoom] : undefined}
    >
      {children}
      <ScaleControl />
      <ZoomControl />
      <StyleSwitcher mapStyles={mapStyles} activeMapStyle={mapStyle} setMapStyle={setMapStyle} />
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
