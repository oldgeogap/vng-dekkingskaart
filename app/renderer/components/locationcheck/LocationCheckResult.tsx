import { IconButton } from "@chakra-ui/button";
import { useRouter } from "next/router";
import * as React from "react";
import { VscChevronLeft, VscClose } from "react-icons/vsc";
import { styled } from "renderer/ui/theme";
import { LocationPoint } from "./LocationCheckProvider";
import { LocationCheckResultPreload } from "./result/LocationCheckResultPreload";

export interface LocationCheckResultProps {
  points: LocationPoint[];
  coverageFileIds: number[];
}

export function LocationCheckResult({ points, coverageFileIds }: LocationCheckResultProps) {
  console.log("LOC CHECK RESULT", points, coverageFileIds);
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
          onClick={() => router.push("/locatiecheck")}
        />
      </Back>
      <LocationCheckResultPreload points={points} coverageFileIds={coverageFileIds} />
    </>
  );
}

const Back = styled.div`
  position: fixed;
  right: 10px;
  top: 10px;
`;
