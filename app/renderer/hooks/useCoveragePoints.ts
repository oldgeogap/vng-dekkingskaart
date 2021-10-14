import * as React from "react";
import electron from "electron";
import { workerActions } from "../../shared";
import { LocationPoint } from "renderer/components/locationcheck/LocationCheckProvider";

const ipcRenderer = electron.ipcRenderer || false;

export type CoveragePointEntryInput = {
  id: string;
  coverageFilePath: string;
  points: LocationPoint[];
};

export type CoveragePointEntry = {
  id: string;
  loaded: boolean;
  coverageFilePath: string;
  points: LocationPoint[] | null;
};

export interface UseCoveragePointsParams {
  entries: CoveragePointEntryInput[];
}

export interface UseCoveragePointsResult {
  entries: CoveragePointEntry[];
  loading: boolean;
}

export function useCoveragePoints({ entries }: UseCoveragePointsParams) {
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<CoveragePointEntry[]>(
    entries.map((entry) => ({
      id: entry.id,
      loaded: false,
      coverageFilePath: entry.coverageFilePath,
      points: entry.points,
      hasCoverage: null
    }))
  );

  React.useEffect(() => {
    if (ipcRenderer) {
      const onResult = (event, resp) => {
        console.log("onResult", resp);
        let data = resp.result;
        setResult((old) => {
          let entry = old.find((entry) => entry.id === data.id);
          if (entry) {
            entry.loaded = true;
            entry.points = data.points;
            return [...old.filter((o) => o.id !== data.id), entry];
          }
          return old;
        });
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
      let entry = result.find((entry) => !entry.loaded);
      if (entry) {
        console.log("Sending entry", entry.id);
        ipcRenderer.send("for-worker", {
          action: workerActions.COVERAGE_POINT,
          payload: {
            id: entry.id,
            coverageFilePath: entry.coverageFilePath,
            points: entry.points
          }
        });
      } else {
        setLoading(false);
      }
    }
  }, [result]);

  return {
    entries: result,
    loading
  };
}
