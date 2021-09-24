import { Button } from "@chakra-ui/button";
import * as React from "react";
import { CoverageFile } from "renderer/db";
import { styled } from "renderer/ui/theme";
import { CoverageFileForm } from "./CoverageFileForm";

import { FileList } from "./FileList";

export interface CoverageHomeProps {}

export function CoverageHome({}: CoverageHomeProps) {
  const [targetFile, setTargetFile] = React.useState<CoverageFile | string | null>(null);

  const newFile = () => {
    setTargetFile("new");
  };
  const onClose = () => {
    setTargetFile(null);
  };

  const isOpen = targetFile !== null;

  return (
    <CoverageHomeContainer>
      <Button onClick={newFile}>Voeg bestand toe</Button>
      <FileList
        onEdit={(file: CoverageFile) => {
          console.log("on edit?", file);
          setTargetFile(file);
        }}
      />
      {isOpen && <CoverageFileForm isOpen={isOpen} onClose={onClose} file={targetFile} />}
    </CoverageHomeContainer>
  );
}

const CoverageHomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
