import * as React from "react";

import centroid from "@turf/centroid";
import { useMap } from "./MapRenderer";
import { HoverInfo } from "./MapHover";
import { IoCompassSharp } from "react-icons/io5";

export interface MapClickProps {
  layerId: string;
  source: string;
  sourceLayer?: string;
  children?: (info: HoverInfo | null) => React.ReactNode;
}

var _hoverStateId: string | number | null = null;

export function MapClick({ layerId, source, sourceLayer, children }: MapClickProps) {
  const map = useMap();
  const [info, setInfo] = React.useState<HoverInfo | null>(null);

  React.useEffect(() => {
    const mouseClick = (e: any) => {
      let features = map.queryRenderedFeatures(e.point, { layers: [layerId] });

      if (features.length) {
        map.getCanvas().style.cursor = "pointer";
        let mapboxFeature: mapboxgl.MapboxGeoJSONFeature = features[0];

        map.setFeatureState({ source, sourceLayer, id: mapboxFeature.properties.id }, { active: true });

        let targetFeature: any = mapboxFeature;
        if (mapboxFeature.geometry.type !== "Point") {
          targetFeature = centroid(targetFeature.geometry);
        }

        let coords = targetFeature.geometry.coordinates;

        let p = map.project(coords);
        let rect = map.getContainer().getBoundingClientRect();
        let containerHeight = rect.bottom - rect.top;
        setInfo({
          x: p.x,
          y: p.y,
          feature: mapboxFeature,
          containerHeight
        });
      } else {
        setInfo(null);
      }
    };

    if (map) {
      map.on("click", mouseClick);
    }

    return () => {
      if (map) {
        map.off("click", mouseClick);
      }
    };
  }, [map]);

  if (children) {
    return <>{children(info)}</>;
  }
  return null;
}
