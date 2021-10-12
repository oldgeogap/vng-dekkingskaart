import * as React from "react";
import { CoverageFile, db, Municipality } from "renderer/db";
import { MiniCompetitionResultPrecalculate } from "./MiniCompetitionResultPrecalculate";

export interface MiniCompetitionPreloadProps {
  municipalityIds: string[];
  coverageFileIds: number[];
}

export function MiniCompetitionPreload({ municipalityIds, coverageFileIds }: MiniCompetitionPreloadProps) {
  const [municipalities, setMunicipalities] = React.useState<Municipality[]>([]);
  const [coverageFiles, setCoverageFiles] = React.useState<CoverageFile[]>([]);

  React.useEffect(() => {
    const doLoad = async (municipalityIds: string[], coverageFileIds: number[]) => {
      let munis = await db.municipality.bulkGet(municipalityIds);
      let covs = await db.coveragefile.bulkGet(coverageFileIds);

      setMunicipalities(munis);
      setCoverageFiles(covs);
    };

    doLoad(municipalityIds, coverageFileIds);
  }, [municipalityIds, coverageFileIds]);

  if (municipalities.length === 0 || coverageFiles.length === 0) {
    return <div>Preloading</div>;
  }

  return <MiniCompetitionResultPrecalculate municipalities={municipalities} coverageFiles={coverageFiles} />;
}
