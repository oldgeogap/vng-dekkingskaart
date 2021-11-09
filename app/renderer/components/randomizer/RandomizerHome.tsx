import * as React from "react";
import { styled } from "renderer/ui/theme";
import { CoverageFileLayers } from "../coverage/CoverageFileLayer";
import { CoverageSelection } from "../coverage/CoverageSelection";
import { MapRenderer } from "../map/MapRenderer";
import { MunicipalityLayer } from "../municipality/MunicipalityLayer";
import { MunicipalitySelection } from "../municipality/MunicipalitySelection";
import { useApp } from "../provider/AppProvider";
import { useAppState } from "../provider/AppStateProvider";
import { RandomizerControl } from "./RandomizerControl";
import { RandomizerLayer } from "./RandomizerLayer";
import { RandomizerLocationSelection } from "./RandomizerLocationSelection";
import { RandomizerProvider, useRandomizer } from "./RandomizerProvider";

export interface RandomizerHomeProps {}

export function RandomizerHome() {
  return (
    <RandomizerProvider>
      <RandomizerHomeInner />
    </RandomizerProvider>
  );
}

export function RandomizerHomeInner({}: RandomizerHomeProps) {
  const [coverageFileVisible, setCoverageFileVisible] = React.useState<number[]>([]);
  const { randomPointSelection } = useAppState();
  return (
    <RandomizerHomeContainer>
      <Municipalities>
        <MunicipalitySelection />
      </Municipalities>
      <CoverageMaps>
        <CoverageSelection coverageFileVisible={coverageFileVisible} setCoverageFileVisible={setCoverageFileVisible} />
      </CoverageMaps>
      <RandomizerLocationSelection />
      <RandomizerControl />
      <MapContainer>
        <MapRenderer
          fitBounds={[
            [2.7343181874860534, 50.589232338769364],
            [8.007755687486053, 53.65674661767193]
          ]}
        >
          <MunicipalityLayer showMode={randomPointSelection && randomPointSelection.length > 0} />
          <RandomizerLayer />
          <CoverageFileLayers visibleIDS={coverageFileVisible} />
        </MapRenderer>
      </MapContainer>
    </RandomizerHomeContainer>
  );
}

const RandomizerHomeContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  grid-template-rows: 9fr 1fr;
  grid-template-areas:
    "muni cov loc map"
    "control control control map";
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
