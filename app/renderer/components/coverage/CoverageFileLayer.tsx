import * as React from "react";
import { GeoJSONLayer } from "react-mapbox-gl";
import { CoverageFile } from "renderer/db";
import { useLoadFile } from "renderer/hooks/useLoadFile";
import { useAppState } from "../provider/AppStateProvider";

export interface CoverageFileLayersProps {
  visibleIDS: number[];
  beforeId?: string;
}

export interface CoverageFileLayerProps {
  file: CoverageFile;
  beforeId?: string;
}

export function CoverageFileLayers({ visibleIDS, beforeId }: CoverageFileLayersProps) {
  const { coverageSelection } = useAppState();

  let showFiles = React.useMemo(
    () => coverageSelection.filter((cf) => visibleIDS.includes(cf.id)),
    [coverageSelection, visibleIDS]
  );

  return (
    <>
      {showFiles
        .filter((cf) => cf.path)
        .map((cf) => (
          <CoverageFileLayer key={cf.id} file={cf} beforeId={beforeId} />
        ))}
    </>
  );
}

function CoverageFileLayer({ file, beforeId }: CoverageFileLayerProps) {
  if (!file.path) return null;

  const { data, loading, error } = useLoadFile(file.path.replace(".geojson", ".origin.geojson"), true);
  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }
  return (
    <GeoJSONLayer
      key={file.id}
      id={`source-${file.id}`}
      beforeId={beforeId}
      data={data}
      fillPaint={{
        "fill-color": "#2D006A",
        "fill-opacity": 0.4
      }}
    />
  );
}
