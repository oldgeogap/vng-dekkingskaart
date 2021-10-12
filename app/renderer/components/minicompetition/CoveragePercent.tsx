import * as React from "react";

export interface CoveragePercentProps {
  coverageFile: string;
  municipalityIds: string[];
}

export function CoveragePercent({ coverageFile, municipalityIds }: CoveragePercentProps) {
  return (
    <div>
      {coverageFile} / {municipalityIds.join(",")}
    </div>
  );
}
