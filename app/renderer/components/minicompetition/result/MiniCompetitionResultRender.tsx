import * as React from "react";
import { MapState, useMapRenderImage } from "renderer/components/map/render/useMapRenderImage";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile, Municipality } from "renderer/db";
import { CoveragePercentEntry } from "renderer/hooks/useCoveragePercent";
import { styled } from "renderer/ui/theme";
import { bbox } from "@turf/turf";
import { MiniCompetitionResultRenderPDF } from "./MiniCompetitionResultRenderPDF";
import { PDFViewer } from "@react-pdf/renderer";
import { AnimatePresence } from "framer-motion";
import { FeedbackPanel } from "renderer/ui/panel";

export interface MiniCompetitionResultRenderProps {
  municipalities: Municipality[];
  coverageFiles: CoverageFile[];
  entries: CoveragePercentEntry[];
}

export function MiniCompetitionResultRender({
  municipalities,
  coverageFiles,
  entries
}: MiniCompetitionResultRenderProps) {
  const { providerName, coverageTypeName } = useApp();

  const renderImageProps = React.useMemo(
    () => ({
      dpi: 96,
      renderContainer: document.body,
      mapStates: getMapStates(coverageFiles, entries)
    }),
    [entries]
  );

  const { generating, images } = useMapRenderImage(renderImageProps);

  const getLabelAndSublabel = (id: string | number) => {
    let covFile = coverageFiles.find((covFile) => covFile.id == id);
    if (covFile) {
      return {
        label: `${providerName(covFile.provider)} ${covFile.year}`,
        subLabel: coverageTypeName(covFile.coverage_type)
      };
    }
    return {
      label: "leeg"
    };
  };

  return (
    <RenderContainer>
      <AnimatePresence>
        {generating && (
          <FeedbackPanel
            title="Genereren kaart afbeeldingen"
            entries={images.map((img) => {
              let { label, subLabel } = getLabelAndSublabel(img.id);
              return {
                label,
                subLabel,
                done: img.image !== null
              };
            })}
          />
        )}
      </AnimatePresence>
      {!generating && (
        <PDFViewer width={window.innerWidth} height={window.innerHeight}>
          <MiniCompetitionResultRenderPDF
            providerName={providerName}
            coverageTypeName={coverageTypeName}
            coverageFiles={coverageFiles}
            entries={entries}
            municipalities={municipalities}
            images={images}
          />
        </PDFViewer>
      )}
    </RenderContainer>
  );
}

const RenderContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

function getMapStates(coverageFiles: CoverageFile[], entries: CoveragePercentEntry[]): MapState[] {
  let result: MapState[] = [];
  coverageFiles.forEach((cov, index) => {
    let entry = entries.find((o) => o.id === `${cov.id}`);

    const workAreaGeoJSON: any = {
      type: "FeatureCollection",
      features: entry.municipalityShapes
    };

    const coverageGeoJSON: any = {
      type: "FeatureCollection",
      features: entry.coverageShapes
    };

    const b = bbox(workAreaGeoJSON);

    let mapState: MapState = {
      id: `${cov.id}`,
      style: "mapbox://styles/mapbox/streets-v9",
      viewport: {
        width: 800,
        height: 600,
        bounds: [
          [b[0], b[1]],
          [b[2], b[3]]
        ],
        boundsOptions: { padding: 52 }
      },
      sources: [
        {
          id: `source${index}workarea`,
          source: {
            type: "geojson",
            data: workAreaGeoJSON
          }
        },
        {
          id: `source${index}coverage`,
          source: {
            type: "geojson",
            data: coverageGeoJSON
          }
        }
      ],
      layers: [
        {
          id: `layer${index}workarea`,
          type: "fill",
          source: `source${index}workarea`,
          paint: {
            "fill-color": "#f200f2",
            "fill-opacity": 0.5
          }
        },
        {
          id: `layer${index}coverage`,
          source: `source${index}coverage`,
          type: "fill",
          paint: {
            "fill-color": "#0000f2",
            "fill-opacity": 0.5
          }
        }
      ]
    };
    result.push(mapState);
  });
  return result;
}
