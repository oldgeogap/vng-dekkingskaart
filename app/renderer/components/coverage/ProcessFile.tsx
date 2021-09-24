import * as React from "react";
import { useProcessFile, ProcessAction, ProcessResult } from "renderer/hooks";

export interface ProcessFileProps {
  action: ProcessAction;
  onResult: (result: ProcessResult) => void;
}

export function ProcessFile({ action, onResult }: ProcessFileProps) {
  const { processPaths, isProcessing, result } = useProcessFile();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    processPaths(action);
  }, [action]);

  React.useEffect(() => {
    if (result) {
      if (!result.success) {
        console.log("Error!", result);
        setError(result.error);
      }
      onResult(result);
    }
  }, [result]);

  return (
    <div>
      <h2>Processing file</h2>
      <p>{isProcessing ? "Processing" : "idle"}</p>
      {error && <p>{error}</p>}
    </div>
  );
}
