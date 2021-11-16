import { Button } from "@chakra-ui/react";

import * as React from "react";

import { styled } from "renderer/ui/theme";
import { useAppState } from "../provider/AppStateProvider";
import { Box, Spinner } from "@chakra-ui/react";
import { RandomizerResultPreload } from "./result/RandomizerResultPreload";
import { VscClose } from "react-icons/vsc";
import { useRouter } from "next/router";

export interface RandomizerResultProps {}

export function RandomizerResult({}: RandomizerResultProps) {
  const router = useRouter();
  const { randomPointSelection, municipalitySelection, coverageSelection } = useAppState();
  const [loaded, setLoaded] = React.useState(false);
  let municipalityIds = municipalitySelection.map((m) => m.id);
  let points = randomPointSelection;
  let coverageFileIds = coverageSelection.map((c) => c.id);

  React.useEffect(() => {
    if (municipalityIds.length || points.length || coverageFileIds.length) {
      setLoaded(true);
    }
  }, [municipalityIds, points, coverageFileIds]);

  if (!loaded)
    return (
      <Box p="32px">
        <Spinner />
      </Box>
    );
  return (
    <>
      <Back>
        <Button
          colorScheme="bg"
          aria-label="Terug"
          leftIcon={<VscClose />}
          size="sm"
          onClick={() => router.push("/randomizer")}
        >
          Sluiten
        </Button>
      </Back>
      <RandomizerResultPreload points={points} municipalityIds={municipalityIds} coverageFileIds={coverageFileIds} />
    </>
  );
}

const Back = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 3;
`;
