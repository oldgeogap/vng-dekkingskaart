import electron from "electron";
import * as React from "react";
import { Button } from "@chakra-ui/react";

const ipcRenderer = electron.ipcRenderer || false;

export interface FSTestProps {}

export default function FSTest({}: FSTestProps) {
  const [doFile, setDoFile] = React.useState(false);
  const [result, setResult] = React.useState([]);
  React.useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("files-selected", (event, data) => {
        setDoFile(false);
        setResult(data);
      });
    }
  }, []);

  React.useEffect(() => {
    if (doFile && ipcRenderer) {
      ipcRenderer.send("browse-files", "some data");
    }
  }, [doFile]);

  return (
    <div>
      <Button colorScheme="blue" isDisabled={doFile} onClick={() => setDoFile(true)}>
        Open File
      </Button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
