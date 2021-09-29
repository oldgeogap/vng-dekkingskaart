import electron from "electron";
import * as React from "react";
import { ipcEvents } from "../../shared";

const ipcRenderer = electron.ipcRenderer || false;

export type DeleteFileResult = {
  success: boolean;
  result?: string;
  error?: string;
};

export interface UseDeleteFileReturn {
  deleteFile: (path: string) => void;
  loading: boolean;
  result: DeleteFileResult | null;
}

export function useDeleteFile(): UseDeleteFileReturn {
  const [path, setPath] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<DeleteFileResult | null>(null);

  React.useEffect(() => {
    if (path && ipcRenderer) {
      const onDeleteResult = (event, data) => {
        setResult(data);
        setPath(null);
      };

      ipcRenderer.once(ipcEvents.DELETE_FILE_RESULT, onDeleteResult);

      ipcRenderer.send(ipcEvents.DELETE_FILE, {
        path
      });
    }
  }, [path]);

  const deleteFile = (p: string) => {
    setPath(p);
  };

  return {
    loading: path !== null,
    deleteFile,
    result
  };
}
