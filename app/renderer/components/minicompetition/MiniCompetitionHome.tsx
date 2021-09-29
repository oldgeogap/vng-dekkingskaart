import * as React from "react";
import { styled } from "renderer/ui/theme";
import { MapRenderer } from "../map/MapRenderer";
import { MapTest } from "../map/MapTest";
import { MunicipalityLayer } from "../municipality/MunicipalityLayer";
import { MunicipalitySelection } from "../municipality/MunicipalitySelection";

export interface MiniCompetitionHomeProps {}

export function MiniCompetitionHome({}: MiniCompetitionHomeProps) {
  return (
    <MiniCompetitionHomeContainer>
      <Municipalities>
        <MunicipalitySelection />
      </Municipalities>
      <CoverageMaps>Dekkingskaarten</CoverageMaps>
      <MapContainer>
        <MapRenderer
          fitBounds={[
            [2.7343181874860534, 50.589232338769364],
            [8.007755687486053, 53.65674661767193]
          ]}
        >
          <MunicipalityLayer />
        </MapRenderer>
      </MapContainer>
    </MiniCompetitionHomeContainer>
  );
}

const MiniCompetitionHomeContainer = styled.div`
  flex: 1;
  display: flex;
`;

const Municipalities = styled.section`
  flex: 0 0 20%;
  border-right: 1px solid ${(props) => props.theme.colors.bg[100]};

  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

const CoverageMaps = styled.section`
  flex: 0 0 20%;
  border-right: 1px solid ${(props) => props.theme.colors.bg[100]};
`;

const MapContainer = styled.section`
  flex: 1 1 auto;
`;
