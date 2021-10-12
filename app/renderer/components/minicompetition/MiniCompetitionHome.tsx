import * as React from "react";
import { styled } from "renderer/ui/theme";
import { CoverageFileLayers } from "../coverage/CoverageFileLayer";
import { CoverageSelection } from "../coverage/CoverageSelection";
import { MapRenderer } from "../map/MapRenderer";
import { MapTest } from "../map/MapTest";
import { MunicipalityLayer } from "../municipality/MunicipalityLayer";
import { MunicipalitySelection } from "../municipality/MunicipalitySelection";
import { MiniCompetitionControl } from "./MiniCompetitionControl";

export interface MiniCompetitionHomeProps {}

export function MiniCompetitionHome({}: MiniCompetitionHomeProps) {
  const [coverageFileVisible, setCoverageFileVisible] = React.useState<number[]>([]);

  return (
    <MiniCompetitionHomeContainer>
      <Municipalities>
        <MunicipalitySelection />
      </Municipalities>
      <CoverageMaps>
        <CoverageSelection coverageFileVisible={coverageFileVisible} setCoverageFileVisible={setCoverageFileVisible} />
      </CoverageMaps>
      <MiniCompetitionControl />

      <MapContainer>
        <MapRenderer
          fitBounds={[
            [2.7343181874860534, 50.589232338769364],
            [8.007755687486053, 53.65674661767193]
          ]}
        >
          <MunicipalityLayer />
          <CoverageFileLayers visibleIDS={coverageFileVisible} />
        </MapRenderer>
      </MapContainer>
    </MiniCompetitionHomeContainer>
  );
}

const MiniCompetitionHomeContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 3fr;
  grid-template-rows: 7fr 1fr;
  grid-template-areas:
    "muni cov map"
    "control control map";
`;

const Municipalities = styled.section`
  grid-area: muni;
  border-right: 1px solid ${(props) => props.theme.colors.bg[100]};

  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

const CoverageMaps = styled.section`
  grid-area: cov;
  border-right: 1px solid ${(props) => props.theme.colors.bg[100]};
`;

const MapContainer = styled.section`
  grid-area: map;
  overflow: hidden;
`;
