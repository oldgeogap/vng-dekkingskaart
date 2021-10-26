import * as React from "react";
import { styled } from "renderer/ui/theme";
import { Geocoder } from "../map/Geocoder";
import { useLocationCheck } from "./LocationCheckProvider";

export interface LocationCheckGeocoderProps {}

export function LocationCheckGeocoder({}: LocationCheckGeocoderProps) {
  const { setPreset } = useLocationCheck();
  return (
    <GeocoderContainer>
      <Geocoder
        onResult={(r) => {
          if (r.coordinates) {
            setPreset({
              x: r.coordinates[0],
              y: r.coordinates[1]
            });
          }
        }}
      />
    </GeocoderContainer>
  );
}

const GeocoderContainer = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
`;
