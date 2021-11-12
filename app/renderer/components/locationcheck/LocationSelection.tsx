import * as React from "react";
import { Filters, FilterSelection, Selection } from "renderer/ui/selection";
import { styled } from "renderer/ui/theme";
import { LocationPointForm } from "./LocationPointForm";
import { useLocationCheck } from "./LocationCheckProvider";
import { Button, IconButton } from "@chakra-ui/button";
import { VscClose } from "react-icons/vsc";
import { LocationPoint } from "renderer/types";
import { useAppState } from "../provider/AppStateProvider";
import { Center } from "@chakra-ui/react";

export interface LocationSelectionProps {}

export function LocationSelection({}: LocationSelectionProps) {
  const { pointSelection, pointDeselect } = useAppState();
  const { setHover } = useLocationCheck();
  const removePoint = (point: LocationPoint) => {
    pointDeselect([point]);
  };

  return (
    <LocationSelectionContainer>
      <FilterSelection>
        <h2>Locaties</h2>
        <Filters>
          <LocationPointForm />
        </Filters>
        <Selection className="scrollit">
          <PointList>
            {pointSelection.map((p, index) => (
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
          {pointSelection.length > 0 && (
            <Center mt={12}>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  pointDeselect(pointSelection);
                }}
              >
                alles verwijderen
              </Button>
            </Center>
          )}
        </Selection>
      </FilterSelection>
    </LocationSelectionContainer>
  );
}

const LocationSelectionContainer = styled.section`
  grid-area: locs;
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
