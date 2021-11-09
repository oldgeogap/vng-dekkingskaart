import * as React from "react";
import { styled } from "renderer/ui/theme";
import { Geocoder } from "../map/Geocoder";
import { useAppState } from "../provider/AppStateProvider";

export interface LocationCheckGeocoderProps {}

export function LocationCheckGeocoder({}: LocationCheckGeocoderProps) {
  const { pointSelect } = useAppState();
  return (
    <GeocoderContainer>
      <Geocoder
        onResult={(r) => {
          if (r.coordinates) {
            pointSelect([
              {
                x: r.coordinates[0],
                y: r.coordinates[1]
              }
            ]);
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
