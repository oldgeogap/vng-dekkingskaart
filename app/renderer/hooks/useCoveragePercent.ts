import * as React from "react";
import electron from "electron";
import { workerActions } from "../../shared";
import { Feature, MultiPolygon } from "@turf/turf";

const ipcRenderer = electron.ipcRenderer || false;

export type CoveragePercentEntryInput = {
  id: string;
  coverageFilePath: string;
  municipalityIds: string[];
};

export type CoveragePercentEntry = {
  id: string;
  loaded: boolean;
  coverageFilePath: string;
  municipalityIds: string[];
  coveragePercent: number | null;
  coverageShape: Feature<MultiPolygon> | null;
  municipalityShapes: Feature<MultiPolygon>[] | null;
};

export interface UseCoveragePercentParams {
  entries: CoveragePercentEntryInput[];
}

export interface UseCoveragePercentResult {
  entries: CoveragePercentEntry[];
  loading: boolean;
}

export function useCoveragePercent({ entries }: UseCoveragePercentParams) {
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<CoveragePercentEntry[]>(
    entries.map((entry) => ({
      id: entry.id,
      loaded: false,
      coverageFilePath: entry.coverageFilePath,
      municipalityIds: entry.municipalityIds,
      coveragePercent: null,
      coverageShape: null,
      municipalityShapes: null
    }))
  );

  React.useEffect(() => {
    if (ipcRenderer) {
      const onResult = (event, resp) => {
        console.log("onResult", resp);
        if (resp.error) {
          console.error(resp.error);
          throw Error(resp.error.message);
        }
        if (resp.result) {
          let data = resp.result;
          setResult((old) => {
            let entry = old.find((entry) => entry.id === data.id);
            if (entry) {
              entry.loaded = true;
              entry.coveragePercent = data.coveragePercent;
              entry.coverageShape = data.coverageShape;
              entry.municipalityShapes = data.municipalityShapes;
              return [...old.filter((o) => o.id !== data.id), entry];
            }
            return old;
          });
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
      let entry = result.find((entry) => !entry.loaded);
      if (entry) {
        console.log("Sending entry", entry.id);
        ipcRenderer.send("for-worker", {
          action: workerActions.COVERAGE_PERCENT,
          payload: {
            id: entry.id,
            coverageFilePath: entry.coverageFilePath,
            municipalityIds: entry.municipalityIds
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
