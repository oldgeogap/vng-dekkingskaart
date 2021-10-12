import * as React from "react";
import { GeoJSONLayer } from "react-mapbox-gl";
import { CoverageFile } from "renderer/db";
import { useLoadFile } from "renderer/hooks/useLoadFile";
import { useAppState } from "../provider/AppStateProvider";

export interface CoverageFileLayersProps {
  visibleIDS: number[];
}

export interface CoverageFileLayerProps {
  file: CoverageFile;
}

export function CoverageFileLayers({ visibleIDS }: CoverageFileLayersProps) {
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
          <CoverageFileLayer key={cf.id} file={cf} />
        ))}
    </>
  );
}

function CoverageFileLayer({ file }: CoverageFileLayerProps) {
  if (!file.path) return null;

  const { data, loading, error } = useLoadFile(file.path, true);
  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }
  return (
    <GeoJSONLayer
      key={file.id}
      id={`source-${file.id}`}
      data={data}
      fillPaint={{
        "fill-color": "red",
        "fill-opacity": 0.8
      }}
    />
  );
}
