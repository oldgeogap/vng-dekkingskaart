import * as React from "react";
import { CoverageFile, db } from "renderer/db";
import { LocationPoint } from "renderer/types";
import { LocationCheckResultPrecalculate } from "./LocationCheckResultPrecalculate";

export interface LocationCheckResultPreloadProps {
  points: LocationPoint[];
  coverageFileIds: number[];
}

export function LocationCheckResultPreload({ points, coverageFileIds }: LocationCheckResultPreloadProps) {
  const [coverageFiles, setCoverageFiles] = React.useState<CoverageFile[]>([]);

  React.useEffect(() => {
    const doLoad = async (coverageFileIds: number[]) => {
      let covs = await db.coveragefile.bulkGet(coverageFileIds);
      setCoverageFiles(covs);
    };

    doLoad(coverageFileIds);
  }, [coverageFileIds]);

  if (coverageFiles.length === 0) {
    return <div>Preloading</div>;
  }

  return <LocationCheckResultPrecalculate points={points} coverageFiles={coverageFiles} />;
}
