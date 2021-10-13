import { FeatureCollection, Feature, Point } from "@turf/helpers";
import * as React from "react";

import { useMap } from "./MapRenderer";

export interface DragPointProps {
  onDragEnd: (x: number, y: number) => void;
}

const _SOURCE_ID = "dragpointsource";
const _LAYER_ID = "dragpointlayer";
export function DragPoint({ onDragEnd }: DragPointProps) {
  const map = useMap();

  React.useEffect(() => {
    const canvas = map.getCanvasContainer();
    const center = map.getCenter();
    let geojson: any = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center.toArray()
          }
        }
      ]
    };

    const onMove = (e) => {
      const coords = e.lngLat;
      canvas.style.cursor = "grabbing";
      geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
      //@ts-ignore
      map.getSource(_SOURCE_ID).setData(geojson);
    };

    const onUp = (e) => {
      const coords = e.lngLat;

      let msg = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
      console.log(msg);
      onDragEnd(coords.lng, coords.lat);
      canvas.style.cursor = "";
      // Unbind mouse/touch events
      map.off("mousemove", onMove);
      map.off("touchmove", onMove);
    };

    if (map.getLayer(_LAYER_ID)) {
      map.removeLayer(_LAYER_ID);
    }
    if (map.getSource(_SOURCE_ID)) {
      map.removeSource(_SOURCE_ID);
    }
    map.addSource(_SOURCE_ID, {
      type: "geojson",
      data: geojson
    });

    map.addLayer({
      id: _LAYER_ID,
      type: "circle",
      source: _SOURCE_ID,
      paint: {
        "circle-radius": 10,
        "circle-color": "#F84C4C" // red color
      }
    });

    map.on("mouseenter", _LAYER_ID, () => {
      map.setPaintProperty(_LAYER_ID, "circle-color", "#3bb2d0");
      canvas.style.cursor = "move";
    });

    map.on("mouseleave", _LAYER_ID, () => {
      map.setPaintProperty(_LAYER_ID, "circle-color", "#3887be");
      canvas.style.cursor = "";
    });

    map.on("mousedown", _LAYER_ID, (e) => {
      // Prevent the default map drag behavior.
      e.preventDefault();

      canvas.style.cursor = "grab";

      map.on("mousemove", onMove);
      map.once("mouseup", onUp);
    });

    map.on("touchstart", _LAYER_ID, (e) => {
      if (e.points.length !== 1) return;

      // Prevent the default map drag behavior.
      e.preventDefault();

      map.on("touchmove", onMove);
      map.once("touchend", onUp);
    });

    return () => {
      if (map) {
        if (map.getLayer(_LAYER_ID)) {
          map.removeLayer(_LAYER_ID);
        }
        if (map.getSource(_SOURCE_ID)) {
          map.removeSource(_SOURCE_ID);
        }
      }
    };
  }, []);

  return null;
}
