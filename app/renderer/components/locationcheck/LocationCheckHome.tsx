import * as React from "react";
import { styled } from "renderer/ui/theme";
import { CoverageFileLayers } from "../coverage/CoverageFileLayer";
import { CoverageSelection } from "../coverage/CoverageSelection";
import { DragPoint } from "../map/DragPoint";
import { MapControlDragPoint } from "../map/MapControlDragPoint";
import { MapRenderer } from "../map/MapRenderer";
import { LocationCheckMapControls } from "./LocationCheckMapControls";
import { LocationCheckProvider, useLocationCheck } from "./LocationCheckProvider";
import { LocationSelection } from "./LocationSelection";

export interface LocationCheckHomeProps {}

export type LocationPoint = {
  x: number;
  y: number;
};

export function LocationCheckHome() {
  return (
    <LocationCheckProvider>
      <LocationCheckHomeInner />
    </LocationCheckProvider>
  );
}

export function LocationCheckHomeInner({}: LocationCheckHomeProps) {
  const [coverageFileVisible, setCoverageFileVisible] = React.useState<number[]>([]);

  return (
    <LocationCheckHomeContainer>
      <LocationSelection />
      <CoverageMaps>
        <CoverageSelection coverageFileVisible={coverageFileVisible} setCoverageFileVisible={setCoverageFileVisible} />
      </CoverageMaps>
      <Control>control</Control>
      <MapContainer>
        <MapRenderer
          fitBounds={[
            [2.7343181874860534, 50.589232338769364],
            [8.007755687486053, 53.65674661767193]
          ]}
        >
          <LocationCheckMapControls />
          <CoverageFileLayers visibleIDS={coverageFileVisible} />
        </MapRenderer>
      </MapContainer>
    </LocationCheckHomeContainer>
  );
}

const LocationCheckHomeContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 3fr;
  grid-template-rows: 9fr 1fr;
  grid-template-areas:
    "locs cov map"
    "control control map";
`;

const CoverageMaps = styled.section`
  grid-area: cov;
  border-right: 1px solid ${(props) => props.theme.colors.bg[100]};
`;

const MapContainer = styled.section`
  grid-area: map;
  overflow: hidden;
`;

const Control = styled.div`
  grid-area: control;
  background-color: red;
`;
