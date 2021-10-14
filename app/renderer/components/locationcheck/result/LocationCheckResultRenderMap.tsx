import { Heading, Center } from "@chakra-ui/react";

import * as React from "react";
import { Feature, GeoJSONLayer, Layer, Source } from "react-mapbox-gl";
import { MapRenderer } from "renderer/components/map/MapRenderer";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile } from "renderer/db";
import { CoveragePointEntry } from "renderer/hooks/useCoveragePoints";
import { styled } from "renderer/ui/theme";
import { bboxForPoints, formatNumber } from "renderer/util";
import { LocationPoint } from "../LocationCheckProvider";

export interface LocationCheckResultRenderMapProps {
  nr: number;
  points: LocationPoint[];
}

export function LocationCheckResultRenderMap({ nr, points }: LocationCheckResultRenderMapProps) {
  const geoJSON = React.useMemo(() => {
    return {
      type: "FeatureCollection",
      features: points.map((p, index) => ({
        type: "Feature",
        properties: {
          nr: `${index + 1}`,
          coverage: !!p.hasCoverage
        },
        geometry: {
          type: "Point",
          coordinates: [p.x, p.y]
        }
      }))
    };
  }, [points]);

  console.log(geoJSON);

  return (
    <RenderMapContainer>
      <MapContainer>
        <MapRenderer fitBounds={bboxForPoints(points)} fitBoundsOptions={{ padding: 64 }} zoom={14}>
          <GeoJSONLayer
            data={geoJSON}
            circlePaint={{
              "circle-radius": 9,
              "circle-color": ["case", ["boolean", ["get", "coverage"], false], "green", "red"],
              "circle-opacity": 0.3,
              "circle-stroke-color": "black",
              "circle-stroke-width": 2
            }}
            symbolLayout={{
              "text-field": "{nr}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12
            }}
          />
        </MapRenderer>
      </MapContainer>
    </RenderMapContainer>
  );
}

const RenderMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  h3 {
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.bg[800]};
    font-size: 12px;
    font-weight: bold;
    padding: 8px 0 4px 0;
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
