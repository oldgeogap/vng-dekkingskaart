import * as React from "react";
import { MAPBOX_TOKEN } from "../MapRenderer";
import * as mapboxgl from "mapbox-gl";

export interface Viewport {
  width: number;
  height: number;
  bounds?: mapboxgl.LngLatBoundsLike;
  boundsOptions?: mapboxgl.FitBoundsOptions;
  center?: [number, number];
  zoom?: number;
}

export type MapState = {
  id: string;
  helperId?: string;
  style: mapboxgl.Style | string;
  viewport: Viewport;
  sources: { id: string; source: mapboxgl.AnySourceData }[];
  layers: mapboxgl.AnyLayer[];
};

export interface UseMapRenderImageParams {
  dpi: number;
  mapStates: MapState[];
  renderContainer: HTMLElement;
}

export type MapImage = {
  id: string;
  helperId?: string;
  image: Blob | null;
  error?: string;
};
export interface UseMapRenderImageReturn {
  generating: boolean;
  images: MapImage[];
}

export type MapRenderState = "idle" | "generating" | "done";

export function useMapRenderImage({ dpi, mapStates, renderContainer }: UseMapRenderImageParams) {
  const [renderState, setRenderState] = React.useState<MapRenderState>("generating");
  const [targetMapState, setTargetMapState] = React.useState<MapState | null>(null);
  const [images, setImages] = React.useState<MapImage[]>([]);

  React.useEffect(() => {
    setImages(
      mapStates.map((mapState) => ({
        id: mapState.id,
        helperId: mapState.helperId,
        image: null
      }))
    );
  }, [mapStates]);

  React.useEffect(() => {
    if (images.length > 0) {
      let trg = images.find((img) => img.image === null && img.error === undefined);
      if (trg) {
        let mapState = mapStates.find((mapState) => mapState.id === trg.id);
        setTargetMapState(mapState);
      } else {
        setRenderState("done");
      }
    }
  }, [images]);

  React.useEffect(() => {
    const action = async (mapState: MapState) => {
      try {
        const { renderMap, destroy } = await createMap(renderContainer, dpi, targetMapState);

        let blob = await generateImage(renderMap, mapState);

        setImages((old) =>
          old.map((img) => (img.id === mapState.id ? { id: img.id, image: blob, helperId: img.helperId } : img))
        );
        destroy();
      } catch (err) {
        setImages((old) =>
          old.map((img) => (img.id === mapState.id ? { id: img.id, image: null, error: err.toString() } : img))
        );
        console.error(err);
      }
    };

    if (targetMapState) {
      action(targetMapState);
    }
  }, [targetMapState]);

  return {
    generating: renderState === "generating",
    images
  };
}
function toPixels(length) {
  "use strict";
  let unit = "mm";
  var conversionFactor = 96;
  if (unit == "mm") {
    conversionFactor /= 25.4;
  }

  return conversionFactor * length + "px";
}

export type CreateMapReturn = {
  destroy: () => void;
  renderMap: mapboxgl.Map;
};

function createMap(container: HTMLElement, dpi: number, mapState: MapState): Promise<CreateMapReturn> {
  return new Promise((resolve, reject) => {
    try {
      // Calculate pixel ratio
      var actualPixelRatio = window.devicePixelRatio;
      Object.defineProperty(window, "devicePixelRatio", {
        get: function () {
          return dpi / 96;
        }
      });

      // Create map container
      var hidden = document.createElement("div");
      hidden.style.overflow = "hidden";
      hidden.style.height = "0";
      hidden.style.width = "0";
      hidden.style.position = "fixed";

      container.appendChild(hidden);
      var mapContainer = document.createElement("div");
      mapContainer.style.width = toPixels(mapState.viewport.width);
      mapContainer.style.height = toPixels(mapState.viewport.height);
      hidden.appendChild(mapContainer);

      let baseOptions = {
        accessToken: MAPBOX_TOKEN,
        container: mapContainer,
        style: mapState.style,
        interactive: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        attributionControl: false
      };

      var renderMap = new mapboxgl.Map(
        mapState.viewport.bounds
          ? {
              ...baseOptions,
              bounds: mapState.viewport.bounds || undefined,
              fitBoundsOptions: mapState.viewport.boundsOptions || undefined
            }
          : {
              ...baseOptions,
              center: mapState.viewport.center || undefined,
              zoom: mapState.viewport.zoom || undefined
            }
      );

      renderMap.once("idle", () => {
        mapState.sources.forEach((source) => {
          renderMap.addSource(source.id, source.source);
        });

        mapState.layers.forEach((layer) => {
          renderMap.addLayer(layer);
        });

        renderMap.once("idle", () => {
          resolve({
            renderMap,
            destroy: () => {
              renderMap.remove();
              hidden.parentNode.removeChild(hidden);
              Object.defineProperty(window, "devicePixelRatio", {
                get: function () {
                  return actualPixelRatio;
                }
              });
            }
          });
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function generateImage(renderMap: mapboxgl.Map, mapState: MapState): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      renderMap.getCanvas().toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    } catch (err) {
      reject(err);
    }
  });
}
