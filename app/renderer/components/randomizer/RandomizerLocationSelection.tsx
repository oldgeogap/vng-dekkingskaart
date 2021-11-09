import * as React from "react";
import { Filters, FilterSelection, Selection } from "renderer/ui/selection";
import { styled } from "renderer/ui/theme";

import { useRandomizer } from "./RandomizerProvider";
import { IconButton } from "@chakra-ui/button";
import { VscClose } from "react-icons/vsc";
import { RandomizerLocationForm } from "./RandomizerLocationForm";
import { LocationPoint } from "renderer/types";
import { useAppState } from "../provider/AppStateProvider";
import { Button, Center } from "@chakra-ui/react";
import { useReverseGeocoder } from "renderer/hooks/useReverseGeocoder";

export interface RandomizerLocationSelectionProps {}

export function RandomizerLocationSelection({}: RandomizerLocationSelectionProps) {
  const { randomPointSelection, randomPointDeselect } = useAppState();
  const { setHover } = useRandomizer();
  const removePoint = (point: LocationPoint) => {
    randomPointDeselect([point]);
  };

  return (
    <RandomizerLocationSelectionContainer>
      <FilterSelection>
        <h2>Willekeurige locaties</h2>
        <Filters>
          <RandomizerLocationForm />
        </Filters>
        <Selection>
          <PointList>
            {randomPointSelection.map((p, index) => (
              <li key={index} onMouseOver={() => setHover(p)} onMouseLeave={() => setHover(null)}>
                <Coords>
                  {p.x.toFixed(7)} <span>,</span> {p.y.toFixed(7)}
                </Coords>
                <IconButton
                  aria-label="verwijderen"
                  variant="ghost"
                  size="xs"
                  icon={<VscClose />}
                  onClick={() => {
                    removePoint(p);
                  }}
                />
              </li>
            ))}
          </PointList>
          {randomPointSelection.length > 0 && (
            <Center mt={12}>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  randomPointDeselect(randomPointSelection);
                }}
              >
                alles verwijderen
              </Button>
            </Center>
          )}
        </Selection>
      </FilterSelection>
    </RandomizerLocationSelectionContainer>
  );
}

const RandomizerLocationSelectionContainer = styled.section`
  grid-area: loc;
  border-right: 1px solid ${(props) => props.theme.colors.bg[100]};

  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

const PointList = styled.ul`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${(props) => props.theme.colors.bg[100]};
  li {
    border-left: 2px solid transparent;
    display: flex;
    justify-content: space-between;
    padding: 4px 8px 4px 14px;
    align-items: center;

    &:hover {
      border-left: 2px solid ${(props) => props.theme.colors.brand[400]};
    }
  }
`;

const Coords = styled.p`
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;

  span {
    color: ${(props) => props.theme.colors.bg[200]};
  }
`;
