import { Button } from "@chakra-ui/button";
import * as React from "react";
import { CoverageFile } from "renderer/db";
import { styled } from "renderer/ui/theme";
import { CoverageFileForm } from "./CoverageFileForm";
import { VscAdd } from "react-icons/vsc";
import { CoverageFileSort, CoverageFileSortKey, useFileList, CoverageFileFilters } from "renderer/hooks";
import { CoverageFileRow } from "./CoverageFileRow";
import { useApp } from "../provider/AppProvider";
import { Table, SortHeader } from "renderer/ui/table";
import { db } from "renderer/db";

import { CoverageFileFilterForm } from "./CoverageFileFilterForm";
import { WorkerTest } from "renderer/worker/WorkerTest";

export interface CoverageHomeProps {}
let n = 0;
export function CoverageHome({}: CoverageHomeProps) {
  const [targetFile, setTargetFile] = React.useState<CoverageFile | string | null>(null);
  const { providerOptions, coverageTypeOptions } = useApp();
  const [sortBy, setSortBy] = React.useState<CoverageFileSort>(["created_at", "desc"]);
  const [filters, setFilters] = React.useState<CoverageFileFilters | null>(null);
  const { files } = useFileList({
    sortBy,
    filters
  });
  const newFile = () => {
    setTargetFile("new");
  };
  const onClose = () => {
    setTargetFile(null);
  };

  React.useEffect(() => {
    const action = async () => {
      let result = await db.municipality.bulkGet(["GM1992"]);
      console.log("RESULT", result);
    };

    action();
  }, []);

  const isOpen = targetFile !== null;

  return (
    <CoverageHomeContainer>
      <ControlBar>
        <Filters>
          <CoverageFileFilterForm onChange={(obj) => setFilters(obj)} />
        </Filters>
        <Button colorScheme="brand" size="sm" onClick={newFile} leftIcon={<VscAdd />}>
          Voeg bestand toe
        </Button>
      </ControlBar>
      <Content>
        <Table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th></th>
              <SortHeader
                active={sortBy[0] === "provider"}
                toggle={(dir) => setSortBy(["provider", dir])}
                dir={sortBy[1]}
              >
                provider
              </SortHeader>
              <th>dekkingstype</th>
              <SortHeader
                active={sortBy[0] === "year"}
                toggle={(dir) => {
                  setSortBy(["year", dir]);
                }}
                dir={sortBy[1]}
              >
                versie
              </SortHeader>
              <SortHeader
                active={sortBy[0] === "created_at"}
                toggle={(dir) => {
                  setSortBy(["created_at", dir]);
                }}
                dir={sortBy[1]}
              >
                aangemaakt
              </SortHeader>
              <th>Dekking</th>
              <th>acties</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <CoverageFileRow
                key={file.id}
                file={file}
                providerOptions={providerOptions}
                coverageTypeOptions={coverageTypeOptions}
                onEdit={(file: CoverageFile) => {
                  setTargetFile(file);
                }}
              />
            ))}
          </tbody>
        </Table>
      </Content>
      {isOpen && <CoverageFileForm isOpen={isOpen} onClose={onClose} file={targetFile} />}
    </CoverageHomeContainer>
  );
}

const CoverageHomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ControlBar = styled.div`
  flex: 0 0 64px;
  background-color: ${(props) => props.theme.colors.bg[50]};
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
`;

const Content = styled.div`
  flex: 1 1 auto;
  overflow-y: scroll;
  padding-top: 16px;
`;

const Filters = styled.div`
  flex: 1 1 auto;
`;
