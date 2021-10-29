import { IconButton } from "@chakra-ui/button";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { VscChevronLeft, VscClose } from "react-icons/vsc";
import { styled } from "renderer/ui/theme";
import { MiniCompetitionPreload } from "./result/MiniCompetitionResultPreload";

export interface MiniCompetitionResultProps {
  municipalityIds: string[];
  coverageFileIds: number[];
}

export function MiniCompetitionResult({ municipalityIds, coverageFileIds }: MiniCompetitionResultProps) {
  const router = useRouter();
  return (
    <>
      <Back>
        <Button
          colorScheme="bg"
          aria-label="Terug"
          leftIcon={<VscClose />}
          size="sm"
          onClick={() => router.push("/minicompetitie")}
        >
          Sluiten
        </Button>
      </Back>
      <MiniCompetitionPreload municipalityIds={municipalityIds} coverageFileIds={coverageFileIds} />
    </>
  );
}

const Back = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 3;
`;
