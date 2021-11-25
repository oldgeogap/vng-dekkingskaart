import * as React from "react";
import { useRandomizer } from "./RandomizerProvider";
import { Layer, Feature, Marker } from "react-mapbox-gl";
import { MapBounds } from "../map/MapBounds";
import { LocationPoint } from "renderer/types";
import { MapHoverPopup } from "../map/MapHoverPopup";
import { MapClick } from "../map/MapClick";
import { Button } from "@chakra-ui/button";
import { useAppState } from "../provider/AppStateProvider";
import { styled } from "renderer/ui/theme";

export interface RandomizerLayerProps {}

export const _layer_id = "randomizer-layer-points";

export function RandomizerLayer({}: RandomizerLayerProps) {
  const { hover } = useRandomizer();
  const { randomPointDeselect, randomPointSelection } = useAppState();

  const removePoint = (x: number, y: number) => {
    randomPointDeselect([{ x, y }]);
  };

  const hasPoint = (x: number, y: number) => {
    let f = randomPointSelection.findIndex((p) => p.x === x && p.y === y);
    return f !== -1;
  };

  return (
    <>
      <Layer
        type="circle"
        id={_layer_id}
        paint={{
          "circle-color": "transparent",
          "circle-stroke-color": "#004d40",
          "circle-stroke-width": 3,
          "circle-radius": 4
        }}
      >
        {randomPointSelection.map((point, i) => (
          <Feature
            coordinates={[point.x, point.y]}
            key={i}
            properties={{
              x: point.x,
              y: point.y
            }}
          />
        ))}
      </Layer>
      {randomPointSelection && randomPointSelection.length > 0 && (
        <MapBounds points={randomPointSelection.map((p) => [p.x, p.y])} />
      )}

      <MapClick source={_layer_id} layerId={_layer_id}>
        {(info) => {
          if (!info) return null;
          if (!hasPoint(info.feature.properties.x, info.feature.properties.y)) return null;

          return (
            <MapHoverPopup hoverInfo={info} title={"Punt"} actionable>
              <div>
                <Button
                  colorScheme="brand"
                  size="xs"
                  onClick={() => {
                    removePoint(info.feature.properties.x, info.feature.properties.y);
                  }}
                >
                  verwijderen
                </Button>
              </div>
            </MapHoverPopup>
          );
        }}
      </MapClick>
      {hover && (
        <Marker coordinates={[hover.x, hover.y]} anchor="center" style={{ width: "21px", height: "21px" }}>
          <MyMarker />
        </Marker>
      )}
    </>
  );
}

const MyMarker = styled.div`
  width: 20px;
  height: 20px;
  border: 6px solid red;
  border-radius: 50%;

  opacity: 0.6;
`;
