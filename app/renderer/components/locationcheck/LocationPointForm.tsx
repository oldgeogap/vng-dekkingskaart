import { IconButton, Input, Center } from "@chakra-ui/react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { VscAdd, VscClose } from "react-icons/vsc";
import { styled } from "renderer/ui/theme";
import { useLocationCheck } from "./LocationCheckProvider";
import { LocationPoint } from "./LocationCheckProvider";

export interface LocationPointFormProps {}

type Inputs = {
  x: number;
  y: number;
};

export function LocationPointForm({}: LocationPointFormProps) {
  const { preset, setPoints } = useLocationCheck();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<Inputs>();

  React.useEffect(() => {
    if (preset) {
      setValue("x", preset.x);
      setValue("y", preset.y);
    }
  }, [preset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setPoints((p) => [...p, data]);
    reset();
  };

  return (
    <LocationPointFormContainer>
      <h3>
        Nieuw punt
        <IconButton aria-label="herstellen" icon={<VscClose />} onClick={() => reset()} variant="ghost" size="xs" />
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <label>X</label>
          <Input
            type="number"
            variant="flushed"
            placeholder="X coordinaat"
            size="sm"
            {...register("x", { valueAsNumber: true })}
            step="any"
          />
        </section>
        <section>
          <label>Y</label>
          <Input
            type="number"
            variant="flushed"
            placeholder="Y coordinaat"
            size="sm"
            {...register("y", { valueAsNumber: true })}
            step="any"
          />
        </section>

        <Center>
          <IconButton
            colorScheme="brand"
            aria-label="Toevoegen"
            icon={<VscAdd />}
            isRound
            size="xs"
            type="submit"
            mt="8px"
          />
        </Center>
      </form>
    </LocationPointFormContainer>
  );
}

const LocationPointFormContainer = styled.div`
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  form {
    padding: 0 16px;
    section {
      display: flex;
      align-items: center;
      label {
        flex: 0 0 16px;
        font-weight: bold;
        color: ${(props) => props.theme.colors.brand[400]};
      }
    }
  }
`;
