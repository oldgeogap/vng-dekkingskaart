import { Heading, Center, Spinner, Button } from "@chakra-ui/react";
import * as React from "react";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile, Municipality } from "renderer/db";

import { CoveragePointEntry } from "renderer/hooks/useCoveragePoints";
import { LocationPoint } from "renderer/types";
import { CoverageFileHeader } from "renderer/ui/header/CoverageFileHeader";
import { styled } from "renderer/ui/theme";
import { RandomizerResultRenderPDF } from "./RandomizerResultRenderPDF";

import { useMapRenderImage, MapState } from "renderer/components/map/render/useMapRenderImage";
import { PDFViewer } from "@react-pdf/renderer";
import { AnimatePresence } from "framer-motion";
import { FeedbackPanel } from "renderer/ui/panel";
import { PDFLoadingIndication } from "renderer/components/locationcheck/result/LocationCheckResultRender";
import { RandomizerDownloadCSV } from "./RandomizerDownloadCSV";
import { fileTimeStamp } from "renderer/util";
export interface RandomizerResultRenderProps {
  coverageFiles: CoverageFile[];
  entries: CoveragePointEntry[];
  municipalities: Municipality[];
  points: LocationPoint[];
}

export function RandomizerResultRender({
  coverageFiles,
  municipalities,
  points,
  entries
}: RandomizerResultRenderProps) {
  const { providerName, coverageTypeName } = useApp();
  const [doCSV, setDoCSV] = React.useState(false);
  const renderImageProps = React.useMemo(
    () => ({
      dpi: 96,
      renderContainer: document.body,
      mapStates: getMapStates(entries)
    }),
    [entries]
  );
  const { generating, images } = useMapRenderImage(renderImageProps);

  return (
    <RenderContainer>
      <AnimatePresence>
        {generating && (
          <FeedbackPanel
            title="Genereren kaart afbeeldingen"
            entries={coverageFiles.map((covFile) => {
              let imgs = images.filter((img) => img.helperId && img.helperId === `${covFile.id}`);
              let total = imgs.length;
              let loaded = imgs.reduce((acc, img) => (img.image !== null ? acc + 1 : acc), 0);
              return {
                label: `${providerName(covFile.provider)} ${coverageTypeName(covFile.coverage_type)} ${covFile.year}`,
                subLabel: `Punt ${loaded} / ${total}`,
                done: total === loaded
              };
            })}
          />
        )}
      </AnimatePresence>
      {!generating && (
        <>
          <PDFViewer width={window.innerWidth} height={window.innerHeight} style={{ position: "absolute", zIndex: 2 }}>
            <RandomizerResultRenderPDF
              providerName={providerName}
              coverageTypeName={coverageTypeName}
              coverageFiles={coverageFiles}
              municipalities={municipalities}
              points={points}
              entries={entries}
              images={images}
            />
          </PDFViewer>
          <PDFLoadingIndication>
            <div className="holder">
              PDF aan het genereren <Spinner ml={16} />
            </div>
          </PDFLoadingIndication>
          <CSVButtonContainer>
            <Button colorScheme="bg" size="sm" onClick={() => setDoCSV(true)}>
              CSV
            </Button>
          </CSVButtonContainer>
        </>
      )}

      {doCSV && (
        <RandomizerDownloadCSV
          filename={`locatiecheck_${fileTimeStamp()}`}
          onDone={() => setDoCSV(false)}
          providerName={providerName}
          coverageTypeName={coverageTypeName}
          coverageFiles={coverageFiles}
          points={points}
          entries={entries}
          images={images}
        />
      )}
    </RenderContainer>
  );
}

const RenderContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const CSVButtonContainer = styled.div`
  right: 110px;
  bottom: 10px;
  position: absolute;
  z-index: 999;
`;

function getMapStates(entries: CoveragePointEntry[]): MapState[] {
  let result: MapState[] = [];
  entries.forEach((entry, index) => {
    entry.points.forEach((point, index2) => {
      let geoJson = getGeoJSON(point, index2);
      let mapState: MapState = {
        id: `${index}x${index2}`,
        helperId: entry.id,
        style: "mapbox://styles/mapbox/streets-v9",
        viewport: {
          width: 800,
          height: 600,
          center: [point.x, point.y],
          zoom: 18
        },
        sources: [
          {
            id: `source${index2}coverage`,
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [entry.coverageShape]
              }
            }
          },
          {
            id: `source${index2}`,
            source: {
              type: "geojson",
              data: geoJson
            }
          }
        ],
        layers: [
          {
            id: `layer${index2}coverage`,
            source: `source${index2}coverage`,
            type: "fill",
            paint: {
              "fill-color": "#0000f2",
              "fill-opacity": 0.1
            }
          },
          {
            id: `layer${index2}circle`,
            type: "circle",
            source: `source${index2}`,
            paint: {
              "circle-radius": 24,
              "circle-color": ["case", ["boolean", ["get", "coverage"], false], "green", "red"],
              "circle-opacity": 0.3,
              "circle-stroke-color": "black",
              "circle-stroke-width": 2
            }
          },
          {
            id: `layer${index2}symbol`,
            source: `source${index2}`,
            type: "symbol",
            layout: {
              "text-field": "{nr}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 24
            }
          }
        ]
      };
      result.push(mapState);
    });
  });
  return result;
}

function getGeoJSON(point: LocationPoint, index: number) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          nr: `${index + 1}`,
          coverage: !!point.hasCoverage
        },
        geometry: {
          type: "Point",
          coordinates: [point.x, point.y]
        }
      }
    ]
  } as any;
}
