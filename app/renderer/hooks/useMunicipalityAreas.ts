import * as React from "react";
import electron from "electron";
import { workerActions } from "../../shared";
import { Feature, MultiPolygon } from "@turf/turf";

const ipcRenderer = electron.ipcRenderer || false;

export type MunicipalityArea = {
  id: string;
  name: string;
  area: number;
  area_calculated: number;
};

export function useMunicipalityAreas() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<MunicipalityArea[]>([]);

  React.useEffect(() => {
    if (ipcRenderer) {
      const onResult = (event, resp) => {
        if (resp.error) {
          console.log(resp.error, resp.message);
          setError(resp.message);
          setLoading(false);
        } else if (resp.result) {
          let data = resp.result;
          setLoading(false);
          setResult(data.municipalityAreas);
        }
      };

      ipcRenderer.on("to-renderer", onResult);

      return () => {
        if (ipcRenderer) {
          ipcRenderer.removeListener("to-renderer", onResult);
        }
      };
    }
  }, []);

  React.useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.send("for-worker", {
        action: workerActions.MUNICIPALITY_AREAS,
        payload: {}
      });
    } else {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data: result
  };
}
