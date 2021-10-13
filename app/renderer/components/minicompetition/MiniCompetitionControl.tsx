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
      <section>
        <p>
          <em>{coverageSelection.length}</em> dekkingskaarten
        </p>
        <p>
          <em>{municipalitySelection.length}</em> gemeenten
        </p>
      </section>
      <section>
        <Button
          colorScheme="brand"
          rightIcon={<VscRemoteExplorer />}
          onClick={openWindow}
          isDisabled={coverageSelection.length === 0 || municipalitySelection.length === 0}
        >
          Resultaten ophalen
        </Button>
      </section>
    </ControlContainer>
  );
}

const ControlContainer = styled.aside`
  grid-area: control;
  border-top: 1px solid ${(props) => props.theme.colors.bg[100]};
  background-color: ${(props) => props.theme.colors.bg[600]};

  display: flex;
  align-items: center;
  section {
    flex: 0 0 50%;
    padding: 16px;

    p {
      margin: 0;
      padding: 0;
      color: ${(props) => props.theme.colors.bg[300]};
      text-transform: uppercase;
      font-size: 12px;
      em {
        font-size: 16px;
        font-weight: bold;
        font-style: normal;
        color: ${(props) => props.theme.colors.bg[50]};
      }
    }
  }
`;
