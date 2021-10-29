import { Heading, Spinner, Icon } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { VscCheck } from "react-icons/vsc";
import { useApp } from "renderer/components/provider/AppProvider";
import { CoverageFile, Municipality } from "renderer/db";
import { useCoveragePoints } from "renderer/hooks/useCoveragePoints";
import { LocationPoint } from "renderer/types";

import { styled } from "renderer/ui/theme";

import { RandomizerResultRender } from "./RandomizerResultRender";

export interface RandomizerResultPrecalculateProps {
  points: LocationPoint[];
  coverageFiles: CoverageFile[];
  municipalities: Municipality[];
}

export function RandomizerResultPrecalculate({
  points,
  municipalities,
  coverageFiles
}: RandomizerResultPrecalculateProps) {
  const { providerName, coverageTypeName } = useApp();
  const { loading, entries } = useCoveragePoints({
    entries: coverageFiles.map((cf, index) => ({
      id: `${cf.id}`,
      coverageFilePath: cf.path,
      points
    }))
  });

  const getCovFile = (id: string) => {
    return coverageFiles.find((cf) => `${cf.id}` === id);
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <PrecalculateContainer>
            <Feedback initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -100 }}>
              <Heading mb="16px">Voorberekeningen</Heading>
              <Entries>
                {entries.map((entry, index) => {
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
      {!loading && (
        <RandomizerResultRender
          coverageFiles={coverageFiles}
          municipalities={municipalities}
          points={points}
          entries={entries}
        />
      )}
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
