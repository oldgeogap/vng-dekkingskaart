import * as React from "react";
import ReactMapboxGl, { Layer, Feature, ScaleControl, ZoomControl, RotationControl, Marker } from "react-mapbox-gl";
import { styled } from "renderer/ui/theme";

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BhdGlhbHgiLCJhIjoiY2t0Y21ncjhuMHZ2aDJ2bXlwYjZnNXkxaCJ9.dFShNUjOCOx3Gj5fMWJURw";
const TEST_COORDS: [number, number] = [4.30550685, 52.0870974];
const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
});

export interface MapTestProps {}

export function MapTest({}: MapTestProps) {
  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        width: "480px",
        height: "320px"
      }}
      center={TEST_COORDS}
    >
      <ScaleControl />
      <ZoomControl />
      <RotationControl style={{ top: 80 }} />

      {/* <Layer
        type="circle"
        paint={{
          "circle-radius": 40,
          "circle-color": "red"
        }}
        id="testlayer"
      >
        <Feature coordinates={TEST_COORDS} />
      </Layer> */}
      <Marker coordinates={TEST_COORDS}>
        <Mark />
      </Marker>
    </Map>
  );
}

const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #eaa29b;
`;
