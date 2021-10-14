import * as React from "react";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile } from "renderer/db";
import { styled } from "../theme";

export interface CoverageFileHeaderProps {
  covFile: CoverageFile;
}

export function CoverageFileHeader({ covFile }: CoverageFileHeaderProps) {
  const { providerName, coverageTypeName } = useApp();
  return (
    <CoverageFileHeaderContainer>
      <label>{providerName(covFile.provider)}</label>
      <p>{coverageTypeName(covFile.coverage_type)}</p>
      <span>{covFile.year}</span>
    </CoverageFileHeaderContainer>
  );
}

const CoverageFileHeaderContainer = styled.h2`
  display: flex;
  font-size: 18px;
  label {
    font-weight: bold;
    margin-right: 16px;
  }
  p {
    margin-right: 16px;
  }
`;
