import { Heading, Center } from "@chakra-ui/react";
import { bbox } from "@turf/turf";
import * as React from "react";
import { GeoJSONLayer } from "react-mapbox-gl";
import { MapRenderer } from "renderer/components/map/MapRenderer";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile, Municipality } from "renderer/db";
import { CoveragePercentEntry } from "renderer/hooks/useCoveragePercent";
import { styled } from "renderer/ui/theme";
import { formatNumber } from "renderer/util";

export interface MiniCompetitionResultRenderMapProps {
  nr: number;
  municipalities: Municipality[];
  coverageFile: CoverageFile;
  entry: CoveragePercentEntry;
}

export function MiniCompetitionResultRenderMap({
  nr,
  municipalities,
  coverageFile,
  entry
}: MiniCompetitionResultRenderMapProps) {
  const { providerName, coverageTypeName } = useApp();

  const workAreaGeoJSON = {
    type: "FeatureCollection",
    features: entry.municipalityShapes
  };

  const coverageGeoJSON = {
    type: "FeatureCollection",
    features: [entry.coverageShape]
  };

  const b = bbox(workAreaGeoJSON);

  return (
    <RenderMapContainer>
      <h3>Dekkingskaart {nr}</h3>
      <Info>
        <h2>
          <label>{providerName(coverageFile.provider)}</label>
          <p>{coverageTypeName(coverageFile.coverage_type)}</p>
          <span>{coverageFile.year}</span>
        </h2>
        <Coverage>{formatNumber(entry.coveragePercent, "%")}</Coverage>
      </Info>
      <MapContainer>
        <MapRenderer
          fitBounds={[
            [b[0], b[1]],
            [b[2], b[3]]
          ]}
        >
          <GeoJSONLayer
            id="municipalities"
            data={workAreaGeoJSON}
            fillPaint={{
              "fill-color": "#f200f2",
              "fill-opacity": 0.5
            }}
          />
          <GeoJSONLayer
            id="coverage"
            data={coverageGeoJSON}
            fillPaint={{
              "fill-color": "#0000f2",
              "fill-opacity": 0.5
            }}
          />
        </MapRenderer>
      </MapContainer>
    </RenderMapContainer>
  );
}

const RenderMapContainer = styled.div`
  padding: 32px 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  h3 {
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.bg[800]};
    font-size: 12px;
    padding: 0 0 4px 16px;
  }
`;

const MapContainer = styled.div`
  margin: auto;
  width: 100%;
  height: 400px;
`;

const Info = styled.div`
  background-color: ${(props) => props.theme.colors.bg[50]};
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  h2 {
    label {
      display: inline-block;
      font-weight: bold;
      margin-right: 16px;
    }

    p {
      display: inline-block;
      margin-right: 16px;
    }
  }
  position: relative;
`;

const Coverage = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 8px;
  padding: 4px 8px;

  background-color: ${(props) => props.theme.colors.brand[400]};
  color: white;
  text-align: center;
  font-weight: bold;
`;
