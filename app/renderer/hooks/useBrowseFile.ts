import electron from "electron";
import * as React from "react";
import { ipcEvents } from "../../shared";

const ipcRenderer = electron.ipcRenderer || false;

export interface UseBrowseFileReturn {
  paths: string[] | null;
  browseFiles: () => void;
  loading: boolean;
}

export function useBrowseFile(): UseBrowseFileReturn {
  const [doFile, setDoFile] = React.useState(false);
  const [paths, setPaths] = React.useState<string[] | null>(null);
  React.useEffect(() => {
    if (ipcRenderer) {
      const onBrowseResult = (event, data) => {
        console.log(data);
        setDoFile(false);
        setPaths(data);
      };
      ipcRenderer.on(ipcEvents.BROWSE_FILES_RESULT, onBrowseResult);
      return () => {
        ipcRenderer.removeListener(ipcEvents.BROWSE_FILES_RESULT, onBrowseResult);
      };
    }
  }, []);

  React.useEffect(() => {
    if (doFile && ipcRenderer) {
      console.log("Sending");
      ipcRenderer.send(ipcEvents.BROWSE_FILES, "some data");
    }
  }, [doFile]);

  const browseFiles = () => {
    setDoFile(true);
  };

  return {
    paths,
    loading: doFile,
    browseFiles
  };
}
