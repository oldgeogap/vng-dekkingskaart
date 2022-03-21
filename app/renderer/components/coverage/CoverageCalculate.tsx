import { Spinner, Heading } from "@chakra-ui/react";
import * as React from "react";
import { CoverageFile } from "renderer/db";
import { useCoverageCountryPercent } from "renderer/hooks/useCoverageCountryPercent";
import { updateCoverageFile } from "renderer/db/mutations";
import { styled } from "renderer/ui/theme";
import { msToReadableTime } from "renderer/util";
import { ErrorMessage } from "../error/ErrorMessage";

export interface CoverageCalculateProps {
  file: CoverageFile;
  onDone: () => void;
}

export function CoverageCalculate({ file, onDone }: CoverageCalculateProps) {
  const { calculate, loading, coveragePercent, report, error } = useCoverageCountryPercent();

  React.useEffect(() => {
    calculate(file.path);
  }, []);

  React.useEffect(() => {
    const action = async (percent: number) => {
      await updateCoverageFile(file.id, {
        coveragePercent: percent
      });
      onDone();
    };
    if (coveragePercent) {
      action(coveragePercent);
    }
  }, [coveragePercent]);

  console.log("ERROR", error);
  if (error) {
    return <ErrorMessage label="calculateCoveragePercent" message={error} />;
  }

  return (
    <CorverageCalculateContainer>
      {loading && (
        <Calc>
          <section>
            <Heading size="sm">Bezig met berekenen</Heading>
            {report && (
              <div>
                {report.block} / {report.blockCount} werkblokken
                <br />
                Geschatte tijd: {msToReadableTime(report.blockCount * report.blockDelta)}
              </div>
            )}
          </section>
          <Spinner />
        </Calc>
      )}
      {!loading && !!coveragePercent && (
        <div>
          Bezig met opslaan <Spinner />
        </div>
      )}
    </CorverageCalculateContainer>
  );
}

const CorverageCalculateContainer = styled.div`
  padding-bottom: 16px;
`;

const Calc = styled.div`
  display: flex;
  align-items: center;

  section {
    flex: 1 1 auto;
  }
`;
