import * as React from "react";
import { CoverageFile, db, Municipality } from "renderer/db";
import { useReverseGeocoder } from "renderer/hooks/useReverseGeocoder";
import { LocationPoint } from "renderer/types";
import { RandomizerResultPrecalculate } from "./RandomizerResultPrecalculate";

export interface RandomizerResultPreloadProps {
  points: LocationPoint[];
  coverageFileIds: number[];
  municipalityIds: string[];
}

export function RandomizerResultPreload({ points, municipalityIds, coverageFileIds }: RandomizerResultPreloadProps) {
  const [municipalities, setMunicipalities] = React.useState<Municipality[]>([]);
  const [coverageFiles, setCoverageFiles] = React.useState<CoverageFile[]>([]);
  const [enhancedPoints, setEnhancedPoints] = React.useState<LocationPoint[] | null>(null);
  const { result, loading, error } = useReverseGeocoder({ points });
  React.useEffect(() => {
    const doLoad = async (coverageFileIds: number[]) => {
      let munis = await db.municipality.bulkGet(municipalityIds);
      let covs = await db.coveragefile.bulkGet(coverageFileIds);
      setCoverageFiles(covs);
      setMunicipalities(munis);
    };

    doLoad(coverageFileIds);
  }, [coverageFileIds]);

  React.useEffect(() => {
    if (result) {
      setEnhancedPoints(
        points.map((p, n) => {
          return {
            ...p,
            displayName: result[n] ? result[n].weergavenaam : ""
          };
        })
      );
    }
  }, [result]);

  if (coverageFiles.length === 0 || enhancedPoints === null) {
    return <div>Preloading</div>;
  }

  return (
    <RandomizerResultPrecalculate
      points={enhancedPoints}
      municipalities={municipalities}
      coverageFiles={coverageFiles}
    />
  );
}
