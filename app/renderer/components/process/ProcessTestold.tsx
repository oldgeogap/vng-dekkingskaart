import { Button } from "@chakra-ui/react";
import electron from "electron";
import * as React from "react";
import { IoCheckmarkCircleSharp, IoCloseCircle } from "react-icons/io5";

const ipcRenderer = electron.ipcRenderer || false;

export interface ProcessTestProps {}

export function ProcessTest({}: ProcessTestProps) {
  const [doProcess, setDoProcess] = React.useState(false);
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("process-test", (event, data) => {
        setDoProcess(false);
        setResult(data);
      });
    }
  }, []);

  React.useEffect(() => {
    if (doProcess && ipcRenderer) {
      console.log("Sending");
      ipcRenderer.send("process-test", "some data");
    }
  }, [doProcess]);

  const processSuccess = result && result.name && result.name === "VNG";
  const processRun = result !== null;
  return (
    <div>
      <Button colorScheme="blue" onClick={() => setDoProcess(true)} isDisabled={doProcess}>
        Process test
      </Button>

      {processRun && (
        <div>
          {processSuccess ? "Succes" : "Failure"}
          {processSuccess ? (
            <IoCheckmarkCircleSharp color="green" size="32px" />
          ) : (
            <IoCloseCircle color="red" size="32px" />
          )}
        </div>
      )}
    </div>
  );
}
