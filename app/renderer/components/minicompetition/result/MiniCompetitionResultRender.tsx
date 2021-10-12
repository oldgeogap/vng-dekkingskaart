import { Heading, Center } from "@chakra-ui/react";
import * as React from "react";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile, Municipality } from "renderer/db";
import { CoveragePercentEntry } from "renderer/hooks/useCoveragePercent";
import { styled } from "renderer/ui/theme";
import { MiniCompetitionResultRenderMap } from "./MiniCompetitionResultRenderMap";

export interface MiniCompetitionResultRenderProps {
  municipalities: Municipality[];
  coverageFiles: CoverageFile[];
  entries: CoveragePercentEntry[];
}

export function MiniCompetitionResultRender({
  municipalities,
  coverageFiles,
  entries
}: MiniCompetitionResultRenderProps) {
  const { providerName, coverageTypeName } = useApp();

  const providerIds = React.useMemo(() => {
    let s = new Set<number>();
    coverageFiles.forEach((cov) => s.add(cov.provider));
    return Array.from(s);
  }, [coverageFiles]);

  const coverageTypes = React.useMemo(() => {
    let s = new Set<number>();
    coverageFiles.forEach((cov) => s.add(cov.coverage_type));
    return Array.from(s);
  }, [coverageFiles]);

  const getCoverageFileEntry = (covTypeId: number, providerId: number) => {
    let covFileId = coverageFiles.find((cov) => cov.coverage_type === covTypeId && cov.provider === providerId)?.id;
    if (covFileId) {
      let entry = entries.find((o) => o.id === `${covFileId}`);
      if (entry) {
        return entry;
      }
    }
    return null;
  };

  return (
    <RenderContainer>
      <Heading mb="16px">Minicompetitie</Heading>

      <Summary>
        <section>
          <h2>Gemeenten</h2>
          {municipalities.map((municipality) => (
            <div key={municipality.id}>{municipality.name}</div>
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
              {providerIds.map((id) => (
                <th key={id}>{providerName(id)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coverageTypes.map((covID) => (
              <tr key={covID}>
                <td className="title">{coverageTypeName(covID)}</td>
                {providerIds.map((providerId) => (
                  <td className="value" key={providerId}>
                    {formatNumber(getCoverageFileEntry(covID, providerId)?.coveragePercent, "%")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Center>
      <Spacer />
      {coverageFiles.map((cov, index) => (
        <MiniCompetitionResultRenderMap
          key={cov.id}
          nr={index + 1}
          municipalities={municipalities}
          coverageFile={cov}
          entry={entries.find((o) => o.id === `${cov.id}`)}
        />
      ))}
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

export const numberFormatter = new Intl.NumberFormat("nl-NL");
function formatNumber(num: number, unit: string) {
  if (num) {
    return `${numberFormatter.format(num)}${unit}`;
  }
  return "";
}
