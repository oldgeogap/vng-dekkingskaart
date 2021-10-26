import * as React from "react";
import { Source, Layer, GeoJSONLayer } from "react-mapbox-gl";
import { Municipality } from "renderer/db";
import { MapHover } from "../map/MapHover";
import { MapHoverPopup } from "../map/MapHoverPopup";
import { useMap } from "../map/MapRenderer";
import { useAppState } from "../provider/AppStateProvider";

export interface MunicipalityLayerProps {
  showMode?: boolean;
}

let _hoverStateId = null;
let _curIds = [];

const SOURCE_ID = "municipalities_source";

export function MunicipalityLayer({ showMode }: MunicipalityLayerProps) {
  const map = useMap();
  const { municipalitySelection, municipalitySelect, municipalityDeselect } = useAppState();

  React.useEffect(() => {
    if (map) {
      _curIds.forEach((id) => {
        map.setFeatureState({ source: SOURCE_ID, id }, { active: false });
      });
      municipalitySelection.forEach((muni) => {
        map.setFeatureState({ source: SOURCE_ID, id: muni.id }, { active: true });
      });
      _curIds = municipalitySelection.map((muni) => muni.id);
    }
  }, [map, municipalitySelection]);

  const toggle = (id: string, name: string) => {
    let muni = municipalitySelection.find((m) => m.id === id);
    if (muni) {
      municipalityDeselect([muni.id]);
    } else {
      municipalitySelect([
        {
          id,
          name
        } as Municipality
      ]);
    }
  };

  const fillPaint: mapboxgl.FillPaint = showMode
    ? {
        "fill-color": "transparent"
      }
    : {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#00a1e6",
          ["boolean", ["feature-state", "active"], false],
          "#2ffed5",
          "transparent"
        ],
        "fill-opacity": 0.8
      };

  const linePaint: mapboxgl.LinePaint = showMode
    ? {
        "line-color": ["case", ["boolean", ["feature-state", "active"], false], "#10b39d", "transparent"],
        "line-opacity": 1,
        "line-width": 4,
        "line-offset": -2
      }
    : {
        "line-color": "#004489",
        "line-opacity": 0.8
      };

  return (
    <>
      <GeoJSONLayer
        // @ts-ignore
        id={SOURCE_ID}
        data={"/data/gemeenten.geojson"}
        sourceOptions={{
          promoteId: "code"
        }}
        fillPaint={fillPaint}
        fillOnMouseEnter={(e) => {
          if (showMode) return;
          cursor(e.target, "pointer");
        }}
        fillOnMouseMove={(e: any) => {
          if (showMode) return;
          if (_hoverStateId) {
            e.target.setFeatureState({ source: SOURCE_ID, id: _hoverStateId }, { hover: false });
          }
          _hoverStateId = e.features[0].id;
          e.target.setFeatureState({ source: SOURCE_ID, id: _hoverStateId }, { hover: true });
        }}
        fillOnMouseLeave={(e: any) => {
          if (showMode) return;
          if (_hoverStateId) {
            e.target.setFeatureState({ source: SOURCE_ID, id: _hoverStateId }, { hover: false });
          }
          _hoverStateId = null;
          cursor(e.target, "default");
        }}
        fillOnClick={(e: any) => {
          if (showMode) return;
          if (e.features) {
            let f = e.features[0];
            toggle(f.id, f.properties.gemeentenaam);
          }
        }}
        linePaint={linePaint}
      />
      {!showMode && (
        <MapHover layerId={`${SOURCE_ID}-fill`} source={SOURCE_ID} sourceLayer={undefined}>
          {(info) => (info ? <MapHoverPopup hoverInfo={info} title={info.feature.properties.gemeentenaam} /> : null)}
        </MapHover>
      )}
    </>
  );
}

function cursor(map: any, s: string) {
  map.getCanvasContainer().style.cursor = s;
}
