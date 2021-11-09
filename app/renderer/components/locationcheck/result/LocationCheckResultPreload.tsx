import * as React from "react";
import { CoverageFile, db } from "renderer/db";
import { useReverseGeocoder } from "renderer/hooks/useReverseGeocoder";
import { LocationPoint } from "renderer/types";
import { LocationCheckResultPrecalculate } from "./LocationCheckResultPrecalculate";

export interface LocationCheckResultPreloadProps {
  points: LocationPoint[];
  coverageFileIds: number[];
}

export function LocationCheckResultPreload({ points, coverageFileIds }: LocationCheckResultPreloadProps) {
  const [coverageFiles, setCoverageFiles] = React.useState<CoverageFile[]>([]);
  const [enhancedPoints, setEnhancedPoints] = React.useState<LocationPoint[] | null>(null);
  const { result, loading, error } = useReverseGeocoder({ points });

  React.useEffect(() => {
    const doLoad = async (coverageFileIds: number[]) => {
      let covs = await db.coveragefile.bulkGet(coverageFileIds);
      setCoverageFiles(covs);
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

  return <LocationCheckResultPrecalculate points={enhancedPoints} coverageFiles={coverageFiles} />;
}
