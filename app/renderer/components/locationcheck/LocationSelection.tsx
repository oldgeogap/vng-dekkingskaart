import * as React from "react";
import { Filters, FilterSelection, Selection } from "renderer/ui/selection";
import { styled } from "renderer/ui/theme";
import { LocationPointForm } from "./LocationPointForm";
import { LocationPoint, useLocationCheck } from "./LocationCheckProvider";
import { IconButton } from "@chakra-ui/button";
import { VscClose } from "react-icons/vsc";

export interface LocationSelectionProps {}

export function LocationSelection({}: LocationSelectionProps) {
  const { points, setPoints } = useLocationCheck();

  const removePoint = (point: LocationPoint) => {
    setPoints((old) => old.filter((p) => p.x !== point.x && p.y !== point.y));
  };

  return (
    <LocationSelectionContainer>
      <FilterSelection>
        <h2>Locaties</h2>
        <Filters>
          <LocationPointForm />
        </Filters>
        <Selection>
          <PointList>
            {points.map((p, index) => (
              <li key={index}>
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
    display: flex;
    justify-content: space-between;
    padding: 4px 8px 4px 16px;
    align-items: center;
  }
`;

const Coords = styled.p`
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;

  span {
    color: ${(props) => props.theme.colors.bg[200]};
  }
`;
