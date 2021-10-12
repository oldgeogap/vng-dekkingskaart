import { IconButton } from "@chakra-ui/button";
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
        <IconButton
          colorScheme="bg"
          aria-label="Terug"
          icon={<VscClose />}
          isRound
          size="sm"
          onClick={() => router.push("/minicompetitie")}
        />
      </Back>
      <MiniCompetitionPreload municipalityIds={municipalityIds} coverageFileIds={coverageFileIds} />
    </>
  );
}

const Back = styled.div`
  position: fixed;
  right: 10px;
  top: 10px;
`;
