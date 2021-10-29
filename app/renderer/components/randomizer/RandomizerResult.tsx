import { IconButton } from "@chakra-ui/button";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { VscChevronLeft, VscClose } from "react-icons/vsc";
import { LocationPoint } from "renderer/types";
import { styled } from "renderer/ui/theme";

import { RandomizerResultPreload } from "./result/RandomizerResultPreload";

export interface RandomizerResultProps {
  points: LocationPoint[];
  municipalityIds: string[];
  coverageFileIds: number[];
}

export function RandomizerResult({ points, municipalityIds, coverageFileIds }: RandomizerResultProps) {
  const router = useRouter();
  return (
    <>
      <Back>
        <Button
          colorScheme="bg"
          aria-label="Terug"
          leftIcon={<VscClose />}
          size="sm"
          onClick={() => router.push("/randomizer")}
        >
          Sluiten
        </Button>
      </Back>
      <RandomizerResultPreload points={points} municipalityIds={municipalityIds} coverageFileIds={coverageFileIds} />
    </>
  );
}

const Back = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 3;
`;
