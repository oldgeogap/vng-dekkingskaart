import {
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { VscAdd } from "react-icons/vsc";
import { useRandomPoints } from "renderer/hooks/useRandomPoints";
import { styled } from "renderer/ui/theme";
import { useAppState } from "../provider/AppStateProvider";
import { useRandomizer } from "./RandomizerProvider";

export interface RandomizerLocationFormProps {}

type Inputs = {
  count: number;
};

export function RandomizerLocationForm({}: RandomizerLocationFormProps) {
  const { setPoints } = useRandomizer();
  const { municipalitySelection } = useAppState();
  const { points, loading, getRandomPoints } = useRandomPoints();
  const disabled = municipalitySelection.length === 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: { count: 5 }
  });

  React.useEffect(() => {
    if (points) {
      setPoints(points);
      reset();
    }
  }, [points]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    getRandomPoints({
      count: data.count,
      municipalityIds: municipalitySelection.map((m) => m.id)
    });
  };

  return (
    <RandomizerLocationFormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="pointcount">
          <FormLabel>Punten toevoegen</FormLabel>
          <InputGroup>
            <NumberInput size="sm" isDisabled={disabled}>
              <NumberInputField {...register("count", { required: true, valueAsNumber: true })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <IconButton
              size="sm"
              ml="8px"
              colorScheme="brand"
              aria-label="toevoegen"
              type="submit"
              icon={<VscAdd />}
              isDisabled={disabled}
              isLoading={loading}
            />
          </InputGroup>
        </FormControl>
      </form>
      {disabled && <Msg>Selecteer eerst gemeenten</Msg>}
    </RandomizerLocationFormContainer>
  );
}

const RandomizerLocationFormContainer = styled.div`
  padding: 0 16px;
`;

const Msg = styled.p`
  font-size: 11px;
  font-style: italic;
  color: ${(props) => props.theme.colors.bg[400]};
  text-align: center;
  padding: 4px 0;
`;
