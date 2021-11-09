import * as React from "react";

import centroid from "@turf/centroid";
import { useMap } from "./MapRenderer";

export type HoverInfo = {
  x: number;
  y: number;
  feature: any;
  containerHeight: number;
};

export interface MapHoverProps {
  layerId: string;
  source: string;
  sourceLayer: string;
  children?: (info: HoverInfo | null) => React.ReactNode;
}

var _hoverStateId: string | number | null = null;

export function MapHover({ layerId, source, sourceLayer, children }: MapHoverProps) {
  const map = useMap();
  const [info, setInfo] = React.useState<HoverInfo | null>(null);

  React.useEffect(() => {
    const mouseMove = (e: any) => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
        let feature = e.features[0];
        //dont do anything if it's the same
        if (_hoverStateId === feature.id) return;

        if (_hoverStateId) {
          map.setFeatureState({ source, sourceLayer, id: _hoverStateId }, { hover: false });
        }
        _hoverStateId = feature.id;
        map.setFeatureState({ source, sourceLayer, id: _hoverStateId }, { hover: true });

        let targetFeature = feature;
        if (feature.geometry.type !== "Point") {
          targetFeature = centroid(feature.geometry);
        }

        let coords = targetFeature.geometry.coordinates;

        let p = map.project(coords);
        let rect = map.getContainer().getBoundingClientRect();
        let containerHeight = rect.bottom - rect.top;
        setInfo({
          x: p.x,
          y: p.y,
          feature,
          containerHeight
        });
      }
    };

    const mouseLeave = (e: any) => {
      if (_hoverStateId) {
        map.setFeatureState({ source, sourceLayer, id: _hoverStateId }, { hover: false });
        setInfo(null);
      }
      _hoverStateId = null;
      map.getCanvas().style.cursor = "";
    };

    if (map) {
      map.on("mousemove", layerId, mouseMove);
      map.on("mouseleave", layerId, mouseLeave);
    }

    return () => {
      if (map) {
        map.off("mousemove", layerId, mouseMove);
        map.off("mouseleave", layerId, mouseLeave);
      }
    };
  }, [map]);

  if (children) {
    return <>{children(info)}</>;
  }
  return null;
}
