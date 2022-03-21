import electron from "electron";
import * as React from "react";
import { ipcEvents } from "../../shared";

const ipcRenderer = electron.ipcRenderer || false;

export type ProcessResult = {
  success: boolean;
  path: string | null;
  error?: string;
  stats?: any;
};

export type ProcessAction = {
  paths: string[];
  targetName: string;
};

export interface UseProcessFileParams {}

export interface UseProcessFileReturn {
  processPaths: (action: ProcessAction) => void;
  isProcessing: boolean;
  result: ProcessResult;
}

export function useProcessFile(): UseProcessFileReturn {
  const [processing, setProcessing] = React.useState<ProcessAction | null>(null);
  const [result, setResult] = React.useState<ProcessResult | null>(null);

  React.useEffect(() => {
    if (ipcRenderer) {
      const onProcessResult = (event, data) => {
        setResult(data);
        setProcessing(null);
      };
      ipcRenderer.on(ipcEvents.PROCESS_FILES_RESULT, onProcessResult);
      return () => {
        ipcRenderer.removeListener(ipcEvents.PROCESS_FILES_RESULT, onProcessResult);
      };
    }
  }, []);

  React.useEffect(() => {
    if (processing && ipcRenderer) {
      ipcRenderer.send(ipcEvents.PROCESS_FILES, processing);
    }
  }, [processing]);

  const processPaths = (action: ProcessAction) => {
    setProcessing(action);
  };

  return {
    isProcessing: processing !== null,
    processPaths,
    result
  };
}
