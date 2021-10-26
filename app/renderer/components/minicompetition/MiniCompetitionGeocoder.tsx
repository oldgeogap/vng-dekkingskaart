import * as React from "react";
import { styled } from "renderer/ui/theme";
import { Geocoder } from "../map/Geocoder";
import { useAppState } from "../provider/AppStateProvider";

export interface MiniCompetitionGeocoderProps {}

export function MiniCompetitionGeocoder({}: MiniCompetitionGeocoderProps) {
  const { municipalitySelect } = useAppState();
  return (
    <GeocoderContainer>
      <Geocoder
        onResult={(r) => {
          municipalitySelect([
            {
              id: `GM${r.municipalityCode}`,
              name: r.municipalityName
            }
          ]);
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
