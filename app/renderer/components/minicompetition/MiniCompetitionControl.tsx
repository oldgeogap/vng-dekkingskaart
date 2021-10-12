import { Button } from "@chakra-ui/button";
import { useRouter } from "next/router";
import * as React from "react";
import { VscRemoteExplorer } from "react-icons/vsc";
import { styled } from "renderer/ui/theme";
import { useAppState } from "../provider/AppStateProvider";

export interface MiniCompetitionControlProps {}

export function MiniCompetitionControl({}: MiniCompetitionControlProps) {
  const { coverageSelection, municipalitySelection } = useAppState();
  const router = useRouter();

  const openWindow = () => {
    router.push(
      `/minicompetitie/result/${municipalitySelection.map((muni) => muni.id).join(",")}/${coverageSelection
        .map((cov) => cov.id)
        .join(",")}}`
    );
  };

  return (
    <ControlContainer>
      {coverageSelection.length} dekkingskaarten
      <br />
      {municipalitySelection.length} gemeenten
      <br />
      <Button
        colorScheme="brand"
        rightIcon={<VscRemoteExplorer />}
        onClick={openWindow}
        isDisabled={coverageSelection.length === 0 || municipalitySelection.length === 0}
      >
        Resultaten ophalen
      </Button>
    </ControlContainer>
  );
}

const ControlContainer = styled.aside`
  grid-area: control;
  border-top: 1px solid ${(props) => props.theme.colors.bg[100]};
  background-color: ${(props) => props.theme.colors.bg[600]};
`;
