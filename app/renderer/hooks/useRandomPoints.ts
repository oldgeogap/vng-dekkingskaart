import * as React from "react";
import electron from "electron";
import { workerActions } from "../../shared";
import { LocationPoint } from "renderer/types";
import { CalculateRandomPointsParams } from "renderer/worker/random_points";

const ipcRenderer = electron.ipcRenderer || false;

export interface UseRandomPointsResult {
  getRandomPoints: (params: CalculateRandomPointsParams) => void;
  points: LocationPoint[];
  loading: boolean;
}

export function useRandomPoints() {
  const [loading, setLoading] = React.useState(false);

  const [points, setPoints] = React.useState<LocationPoint[]>([]);

  React.useEffect(() => {
    if (ipcRenderer) {
      const onResult = (event, resp) => {
        console.log("onResult", resp);
        setPoints(resp.result.points);
        setLoading(false);
      };

      ipcRenderer.on("to-renderer", onResult);

      return () => {
        if (ipcRenderer) {
          ipcRenderer.removeListener("to-renderer", onResult);
        }
      };
    }
  }, []);

  const getRandomPoints = (params: CalculateRandomPointsParams) => {
    console.log("Sending random points", params);
    if (ipcRenderer) {
      setLoading(true);
      ipcRenderer.send("for-worker", {
        action: workerActions.RANDOM_POINTS,
        payload: params
      });
    }
  };

  return {
    points,
    loading,
    getRandomPoints
  };
}
