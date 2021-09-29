import * as React from "react";
import { Source, Layer, GeoJSONLayer } from "react-mapbox-gl";
import { Municipality } from "renderer/db";
import { useMap } from "../map/MapRenderer";
import { useAppState } from "../provider/AppStateProvider";

export interface MunicipalityLayerProps {}

let _hoverStateId = null;
let _curIds = [];

const SOURCE_ID = "municipalities_source";

export function MunicipalityLayer({}: MunicipalityLayerProps) {
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

  return (
    <GeoJSONLayer
      id={SOURCE_ID}
      data={"/data/gemeenten.geojson"}
      sourceOptions={{
        promoteId: "code"
      }}
      fillPaint={{
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#00a1e6",
          ["boolean", ["feature-state", "active"], false],
          "red",
          "transparent"
        ],
        "fill-opacity": 0.4
      }}
      fillOnMouseMove={(e: any) => {
        if (_hoverStateId) {
          e.target.setFeatureState({ source: SOURCE_ID, id: _hoverStateId }, { hover: false });
        }
        _hoverStateId = e.features[0].id;
        e.target.setFeatureState({ source: SOURCE_ID, id: _hoverStateId }, { hover: true });
      }}
      fillOnMouseLeave={(e: any) => {
        if (_hoverStateId) {
          e.target.setFeatureState({ source: SOURCE_ID, id: _hoverStateId }, { hover: false });
        }
        _hoverStateId = null;
      }}
      fillOnClick={(e: any) => {
        if (e.features) {
          let f = e.features[0];
          toggle(f.id, f.properties.gemeentenaam);
        }
      }}
      linePaint={{
        "line-color": "#004489",
        "line-opacity": 0.8
      }}
    />
  );
}
