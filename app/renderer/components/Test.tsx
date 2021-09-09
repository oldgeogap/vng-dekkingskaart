import { Button, Box, Heading } from "@chakra-ui/react";

import * as React from "react";
import { IoCheckmarkCircleSharp, IoCloseCircle } from "react-icons/io5";
import { styled } from "renderer/ui/theme";
import ClientFSTest from "./fs/ClientFSTest";
import { MapTest } from "./map/MapTest";

export interface TestProps {}

export function Test({}: TestProps) {
  const [check, setCheck] = React.useState(false);
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    const doFetch = async () => {
      const res = await fetch("/api/test");
      const json = await res.json();
      console.log(data);
      setData(json);
    };
    if (check) {
      doFetch();
    }
  }, [check]);

  const processRun = data !== null;
  const processSuccess = processRun && data.name && data.name === "VNG";

  return (
    <TestContainer>
      <Heading size="lg">Test acties</Heading>

      <section>
        <Action>
          <h3>Process test</h3>
          <p>Werkt communicatie met de process server</p>
        </Action>

        <Result>
          <div>
            <Button colorScheme="blue" onClick={() => setCheck(true)} isDisabled={processRun}>
              Process test
            </Button>
          </div>
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
        </Result>
      </section>

      <section>
        <Action>
          <h3>Bestanden</h3>
          <p>Kan je bestanden selecteren</p>
        </Action>
        <Result>
          <ClientFSTest />
        </Result>
      </section>

      <section>
        <Action>
          <h3>Kaart</h3>
          <p>Laad de kaart gecentreerd op Den Haag.</p>
        </Action>
        <Result>
          <MapTest />
        </Result>
      </section>

      <section>
        <Action>
          <h3>Scrollen</h3>
          <p>Kan je scrollen op deze pagina</p>
        </Action>
        <Result>
          <div>
            {Array.from(new Array(20).fill("a")).map((el, i) => (
              <div key={i}>item {i + 1}</div>
            ))}
          </div>
        </Result>
      </section>
    </TestContainer>
  );
}

const TestContainer = styled.div`
  padding: 32px;
  flex: 1;
  background-color: ${(props) => props.theme.colors.bg[50]};
  overflow-y: auto;
  section {
    padding: 32px 0;
    border-bottom: 1px solid ${(props) => props.theme.colors.bg[100]};
    display: flex;
  }
`;

const Action = styled.div`
  flex: 0 0 200px;
  padding-right: 32px;

  h3 {
    font-weight: bold;
    font-size: 18px;
  }

  p {
    font-size: 11px;
    margin-top: 8px;
  }
`;

const Result = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: space-between;
`;
