import * as React from "react";
import { useRandomizer } from "./RandomizerProvider";
import { Layer, Feature } from "react-mapbox-gl";
import { MapBounds } from "../map/MapBounds";
import { LocationPoint } from "renderer/types";
import { MapHoverPopup } from "../map/MapHoverPopup";
import { MapClick } from "../map/MapClick";
import { Button } from "@chakra-ui/button";

export interface RandomizerLayerProps {}

const _layer_id = "randomizer-layer-points";

export function RandomizerLayer({}: RandomizerLayerProps) {
  const [activePoint, setActivePoint] = React.useState<LocationPoint | null>(null);
  const { points, setPoints } = useRandomizer();

  const removePoint = (x: number, y: number) => {
    setPoints((old) => old.filter((p) => p.x !== x && p.y !== y));
  };

  const hasPoint = (x: number, y: number) => {
    let f = points.findIndex((p) => p.x === x && p.y === y);
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
        {points.map((point, i) => (
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
      {points && points.length > 0 && <MapBounds points={points.map((p) => [p.x, p.y])} />}

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
    </>
  );
}
