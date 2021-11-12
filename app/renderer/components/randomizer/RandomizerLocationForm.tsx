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

const _max_points = 35;

export function RandomizerLocationForm({}: RandomizerLocationFormProps) {
  const { municipalitySelection, randomPointSelect, randomPointSelection } = useAppState();
  const { points, loading, getRandomPoints } = useRandomPoints();

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
      randomPointSelect(points);
      reset();
    }
  }, [points]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    getRandomPoints({
      count: data.count,
      municipalityIds: municipalitySelection.map((m) => m.id)
    });
  };

  let maxV = _max_points - randomPointSelection.length;
  let disabled = maxV <= 0;

  return (
    <RandomizerLocationFormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="pointcount">
          <FormLabel>Punten toevoegen</FormLabel>
          <InputGroup>
            <NumberInput size="sm" isDisabled={disabled} min={1} max={maxV}>
              <NumberInputField {...register("count", { required: true, valueAsNumber: true, min: 1, max: maxV })} />
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
