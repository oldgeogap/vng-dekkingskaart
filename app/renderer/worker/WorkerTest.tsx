import * as React from "react";
import { ipcRenderer } from "electron";

export interface WorkerTestProps {}

export function WorkerTest({}: WorkerTestProps) {
  React.useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      // Allow renderer process to receive communication
      ipcRenderer.on("to-renderer", (event, arg) => {
        console.log(arg);
        alert(arg);
      });
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners("to-renderer");
      }
    };
  }, []);

  return (
    <div>
      <h2>Worker test</h2>
    </div>
  );
}
