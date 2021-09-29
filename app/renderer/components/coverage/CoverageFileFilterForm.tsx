import { Button, Select, Input } from "@chakra-ui/react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { styled } from "renderer/ui/theme";
import { useApp } from "../provider/AppProvider";
import { CoverageFileFilters } from "renderer/hooks/useFileList";

export interface CoverageFileFilterFormProps {
  onChange: (obj: CoverageFileFilters) => void;
}

export function CoverageFileFilterForm({ onChange }: CoverageFileFilterFormProps) {
  const { providerOptions, coverageTypeOptions } = useApp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CoverageFileFilters>({
    mode: "onChange"
  });

  const onSubmit: SubmitHandler<CoverageFileFilters> = (data) => {
    onChange(data);
  };

  const doReset = () => {
    reset();
    onChange(null);
  };

  return (
    <CoverageFileFilterFormContainer>
      <form onChange={handleSubmit(onSubmit)}>
        <Select variant="flushed" size="sm" {...register("providerId")} mr={4}>
          <option value="">Provider</option>
          {providerOptions.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </Select>
        <Select variant="flushed" size="sm" {...register("coverageTypeId")} mr={4}>
          <option value="">Dekkingstype</option>
          {coverageTypeOptions.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </Select>
        <Input variant="flushed" size="sm" placeholder="jaar" {...register("year")} mr={4} />
        <Button variant="ghost" size="xs" onClick={doReset}>
          herstel
        </Button>
      </form>
    </CoverageFileFilterFormContainer>
  );
}

const CoverageFileFilterFormContainer = styled.div`
  padding-right: 32px;
  form {
    display: flex;
    align-items: center;
  }
`;
