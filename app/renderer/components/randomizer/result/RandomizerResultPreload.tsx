import * as React from "react";
import { CoverageFile, db, Municipality } from "renderer/db";
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

  React.useEffect(() => {
    const doLoad = async (coverageFileIds: number[]) => {
      let munis = await db.municipality.bulkGet(municipalityIds);
      let covs = await db.coveragefile.bulkGet(coverageFileIds);
      setCoverageFiles(covs);
      setMunicipalities(munis);
    };

    doLoad(coverageFileIds);
  }, [coverageFileIds]);

  if (coverageFiles.length === 0) {
    return <div>Preloading</div>;
  }

  return <RandomizerResultPrecalculate points={points} municipalities={municipalities} coverageFiles={coverageFiles} />;
}
