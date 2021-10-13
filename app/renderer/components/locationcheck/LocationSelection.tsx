import * as React from "react";
import { Filters, FilterSelection, Selection } from "renderer/ui/selection";
import { styled } from "renderer/ui/theme";
import { Input } from "@chakra-ui/react";
import { LocationPointForm } from "./LocationPointForm";
import { useLocationCheck } from "./LocationCheckProvider";

export interface LocationSelectionProps {}

export type LocationPoint = {
  x: number;
  y: number;
};

export function LocationSelection({}: LocationSelectionProps) {
  const { points } = useLocationCheck();

  return (
    <LocationSelectionContainer>
      <FilterSelection>
        <h2>Locaties</h2>
        <Filters>
          <LocationPointForm />
        </Filters>
        <Selection>
          {points.map((p, index) => (
            <div key={index}>
              {p.x.toFixed(7)}, {p.y.toFixed(7)}
            </div>
          ))}
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
