import * as React from "react";
import electron from "electron";
import { workerActions } from "../../shared";
import { Report } from "renderer/worker/coverage_country_percent";

const ipcRenderer = electron.ipcRenderer || false;

export interface UseCoverageCountryPercentResult {
  calculate: (path: string) => void;
  coveragePercent: number | null;
  report?: Report;
  loading: boolean;
  error: null | string;
}

export function useCoverageCountryPercent(): UseCoverageCountryPercentResult {
  const [coverageFilePath, setCoverageFilePath] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<number | null>(null);
  const [report, setReport] = React.useState<Report | null>(null);
  React.useEffect(() => {
    if (ipcRenderer) {
      const onResult = (event, resp) => {
        console.log("TEST", resp.error, resp.message);
        if (resp.action === workerActions.COVERAGE_PERCENT_COUNTRY) {
          if (resp.error) {
            setError(resp.message);
          } else if (resp.report) {
            setReport(resp.report);
          } else if (resp.result) {
            let data = resp.result;
            setResult(data.coveragePercent);
            setCoverageFilePath(null);
          }
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
      if (coverageFilePath) {
        ipcRenderer.send("for-worker", {
          action: workerActions.COVERAGE_PERCENT_COUNTRY,
          payload: {
            coverageFilePath: coverageFilePath
          }
        });
      }
    }
  }, [coverageFilePath]);

  const calculate = (path: string) => {
    setCoverageFilePath(path);
  };

  return {
    calculate,
    coveragePercent: result,
    loading: coverageFilePath !== null,
    report,
    error
  };
}
