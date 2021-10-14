import React, { useEffect } from "react";
import { ipcRenderer } from "electron";
import { workerActions } from "../../shared";
import { calculateCoveragePercent } from "renderer/worker/coverage_percent";
import { calculateCoveragePoint } from "renderer/worker/coverage_point";

const Worker = () => {
  // Send logs as messages to the main thread to show on the console
  const log = (value) => {
    ipcRenderer && ipcRenderer.send("to-main", process.pid + ": " + value);
  };

  useEffect(() => {
    if (ipcRenderer) {
      const onAction = async (event, arg) => {
        log("received " + arg.action);
        let result = null;
        if (arg.action) {
          try {
            switch (arg.action) {
              case workerActions.COVERAGE_PERCENT:
                result = await calculateCoveragePercent(arg.payload);
                break;
              case workerActions.COVERAGE_POINT:
                result = await calculateCoveragePoint(arg.payload);
                break;
            }

            ipcRenderer.send("for-renderer", {
              action: arg.action,
              result
            });
          } catch (err) {
            ipcRenderer.send("for-renderer", {
              action: arg.action,
              error: true,
              message: err.message
            });
          }
        }
      };

      ipcRenderer.on("to-worker", onAction);

      // let the main thread know this thread is ready to process something
      ipcRenderer.send("ready");

      return () => {
        if (ipcRenderer) {
          ipcRenderer.removeAllListeners("to-worker");
        }
      };
    }
  }, []);

  return <React.Fragment></React.Fragment>;
};

export default Worker;
