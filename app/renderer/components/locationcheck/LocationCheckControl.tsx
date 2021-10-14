import { Button } from "@chakra-ui/button";
import { useRouter } from "next/router";
import * as React from "react";
import { VscRemoteExplorer } from "react-icons/vsc";
import { styled } from "renderer/ui/theme";
import { useAppState } from "../provider/AppStateProvider";

import { useLocationCheck } from "./LocationCheckProvider";

export interface LocationCheckControlProps {}

export function LocationCheckControl({}: LocationCheckControlProps) {
  const { points } = useLocationCheck();
  const { coverageSelection } = useAppState();
  const router = useRouter();

  const openWindow = () => {
    router.push(
      `/locatiecheck/result/${points.map((point) => `${point.x},${point.y}`).join("x")}/${coverageSelection
        .map((cov) => cov.id)
        .join(",")}}`
    );
  };

  return (
    <ControlContainer>
      <section>
        <p>
          <em>{points.length}</em> punten
        </p>
        <p>
          <em>{coverageSelection.length}</em> dekkingskaarten
        </p>
      </section>
      <section>
        <Button
          colorScheme="brand"
          rightIcon={<VscRemoteExplorer />}
          onClick={openWindow}
          isDisabled={points.length === 0 || coverageSelection.length === 0}
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
