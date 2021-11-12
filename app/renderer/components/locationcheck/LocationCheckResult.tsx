import { IconButton } from "@chakra-ui/button";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { VscChevronLeft, VscClose } from "react-icons/vsc";
import { LocationPoint } from "renderer/types";
import { styled } from "renderer/ui/theme";

import { LocationCheckResultPreload } from "./result/LocationCheckResultPreload";

export interface LocationCheckResultProps {
  points: LocationPoint[];
  coverageFileIds: number[];
}

export function LocationCheckResult({ points, coverageFileIds }: LocationCheckResultProps) {
  const router = useRouter();
  return (
    <>
      <Back>
        <Button
          colorScheme="bg"
          size="sm"
          aria-label="Terug"
          leftIcon={<VscClose />}
          onClick={() => router.push("/locatiecheck")}
        >
          Sluiten
        </Button>
      </Back>
      <LocationCheckResultPreload points={points} coverageFileIds={coverageFileIds} />
    </>
  );
}

const Back = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 3;
`;
