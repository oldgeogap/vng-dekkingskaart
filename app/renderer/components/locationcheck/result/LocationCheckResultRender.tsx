import { Heading, Center } from "@chakra-ui/react";
import * as React from "react";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile } from "renderer/db";

import { CoveragePointEntry } from "renderer/hooks/useCoveragePoints";
import { LocationPoint } from "renderer/types";
import { CoverageFileHeader } from "renderer/ui/header/CoverageFileHeader";
import { styled } from "renderer/ui/theme";

import { LocationCheckResultRenderMap } from "./LocationCheckResultRenderMap";

export interface LocationCheckResultRenderProps {
  coverageFiles: CoverageFile[];
  points: LocationPoint[];
  entries: CoveragePointEntry[];
}

export function LocationCheckResultRender({ coverageFiles, points, entries }: LocationCheckResultRenderProps) {
  const { providerName, coverageTypeName } = useApp();

  const getCovFile = (id: string) => {
    return coverageFiles.find((cf) => `${cf.id}` === id);
  };

  return (
    <RenderContainer>
      <Heading mb="16px">Minicompetitie</Heading>

      <Summary>
        <section>
          <h2>Punten</h2>
          {points.map((point, index) => (
            <div key={index}>
              {point.x.toFixed(7)} , {point.y.toFixed(7)}
            </div>
          ))}
        </section>{" "}
        <section>
          <h2>Dekkingskaarten</h2>
          {coverageFiles.map((coverageFile) => (
            <div className="entry" key={coverageFile.id}>
              <label>{providerName(coverageFile.provider)}</label>
              <p>{coverageTypeName(coverageFile.coverage_type)}</p>
              <span>{coverageFile.year}</span>
            </div>
          ))}
        </section>
      </Summary>

      <Spacer />
      <Center>
        <Table>
          <thead>
            <tr>
              <th className="empty"></th>
              {points.map((p, index) => (
                <th key={index}>Punt {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const covFile = getCovFile(entry.id);
              return (
                <tr key={index}>
                  <td className="title">
                    {providerName(covFile.provider)}
                    {coverageTypeName(covFile.coverage_type)}
                    {covFile.year}
                  </td>
                  {entry.points.map((point, index) => (
                    <td key={index}>{point.hasCoverage ? "JA" : "NEE"}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Center>
      <Spacer />
      <CoverageFileList>
        {entries.map((entry, index) => {
          const covFile = getCovFile(entry.id);
          return (
            <CoverageFileEntry key={entry.id}>
              <h4>Dekkingskaart {index + 1}</h4>
              <CoverageFileHeader covFile={covFile} />

              <LocationCheckResultRenderMap nr={index + 1} points={entry.points} />
            </CoverageFileEntry>
          );
        })}
      </CoverageFileList>
    </RenderContainer>
  );
}

const RenderContainer = styled.div`
  padding: 32px 64px;
`;

const Summary = styled.div`
  display: flex;
  section {
    flex: 0 0 50%;
    h2 {
      text-transform: uppercase;
      color: ${(props) => props.theme.colors.bg[400]};
      font-size: 12px;
    }

    .entry {
      display: flex;
      justify-content: space-between;

      label {
        flex: 0 0 100px;
        font-weight: bold;
      }

      p {
        flex: 1 1 auto;
      }
    }
  }
`;

const Spacer = styled.div`
  height: 1px;
  margin: 32px 0;
  background-color: ${(props) => props.theme.colors.bg[100]};
`;

const Table = styled.table`
  min-width: 600px;

  th {
    text-align: right;
    padding-right: 16px;
    background-color: ${(props) => props.theme.colors.bg[50]};
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    border-top-left-radius: 16px;

    &.empty {
      background-color: transparent;
      border-right: 0;
    }
  }

  tr {
    td {
      background-color: ${(props) => props.theme.colors.bg[50]};
      border-bottom: 2px solid white;
      padding: 4px 8px;
      &.title {
        text-align: left;
        font-weight: bold;
      }

      &.value {
        text-align: right;
        padding-right: 16px;
        border-right: 2px solid white;
      }
    }

    &:nth-of-type(even) {
      td {
        background-color: ${(props) => props.theme.colors.bg[100]};
      }
    }
  }
`;
const CoverageFileList = styled.div``;
const CoverageFileEntry = styled.div`
  h4 {
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.bg[400]};
  }
  margin-bottom: 64px;
`;

const PointList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const PointEntry = styled.div`
  flex: 0 0 50%; /* 50% width */
  margin-bottom: 32px;
  padding-right: 16px;
  &:nth-of-type(even) {
    padding-right: 0;
    padding-left: 16px;
  }
`;

export const numberFormatter = new Intl.NumberFormat("nl-NL");
function formatNumber(num: number, unit: string) {
  if (num) {
    return `${numberFormatter.format(num)}${unit}`;
  }
  return "";
}
