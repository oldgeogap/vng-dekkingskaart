import { Heading, Spinner, Icon } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { VscCheck } from "react-icons/vsc";
import { ErrorMessage } from "renderer/components/error/ErrorMessage";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile, Municipality } from "renderer/db";
import { useCoveragePercent } from "renderer/hooks/useCoveragePercent";
import { styled } from "renderer/ui/theme";
import { MiniCompetitionResultRender } from "./MiniCompetitionResultRender";

export interface MiniCompetitionResultPrecalculateProps {
  municipalities: Municipality[];
  coverageFiles: CoverageFile[];
}

export function MiniCompetitionResultPrecalculate({
  municipalities,
  coverageFiles
}: MiniCompetitionResultPrecalculateProps) {
  const { providerName, coverageTypeName } = useApp();

  console.log("TEST", municipalities);
  const { entries, loading, error } = useCoveragePercent({
    entries: coverageFiles.map((cf, index) => ({
      id: `${cf.id}`,
      municipalityIds: municipalities.map((m) => m.id),
      coverageFilePath: cf.path
    }))
  });

  const getCovFile = (id: string) => {
    return coverageFiles.find((cf) => `${cf.id}` === id);
  };
  console.log("ERROR", error);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <PrecalculateContainer>
            <Feedback initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -100 }}>
              <Heading mb="16px">Voorberekeningen</Heading>
              <Entries>
                {entries.reverse().map((entry) => {
                  let covFile = getCovFile(entry.id);
                  return (
                    <Entry key={entry.id}>
                      <label>{providerName(covFile.provider)}</label>
                      <p>{coverageTypeName(covFile.coverage_type)}</p>
                      {entry.loaded ? <Icon color="green.400" as={VscCheck} /> : <Spinner size="xs" />}
                    </Entry>
                  );
                })}
              </Entries>
            </Feedback>
          </PrecalculateContainer>
        )}
      </AnimatePresence>
      {!loading &&
        (error ? (
          <ErrorMessage label="Worker: useCoveragePercent" message={error} />
        ) : (
          <MiniCompetitionResultRender
            municipalities={municipalities}
            coverageFiles={coverageFiles}
            entries={entries}
          />
        ))}
    </>
  );
}

const PrecalculateContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const _Feedback = styled.div``;
const Feedback = motion(_Feedback);
const Entries = styled.ul`
  list-style: none;
`;

const Entry = styled.li`
  display: flex;
  align-items: center;

  padding: 8px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.bg[50]};

  label {
    font-weight: bold;
    margin-right: 16px;
    flex: 0 0 100px;
  }
  p {
    flex: 1 1 auto;
  }
  &:last-of-type {
    border-bottom: none;
  }

  svg {
    margin-left: auto;
  }
`;
