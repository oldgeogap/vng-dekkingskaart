import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  FormErrorMessage,
  Select
} from "@chakra-ui/react";
import * as React from "react";

import { styled } from "renderer/ui/theme";
import { useForm, useFormState, SubmitHandler } from "react-hook-form";

//import { ProcessFile } from "./ProcessFile";
import { motion } from "framer-motion";
import { FileSelector } from "./FileSelector";
import { CoverageFile, CoverageFileStatus, db } from "renderer/db";
import { useProviderOptions } from "../options/useProviderOptions";
import { useCoverageTypeOptions } from "../options/useCoverageTypeOptions";
import { ProcessAction, ProcessResult } from "renderer/hooks";
import { ProcessFile } from "./ProcessFile";
import { addCoverageFile, updateCoverageFile } from "renderer/db/mutations";

export type Inputs = {
  id?: number;
  provider: number;
  coverageType: number;
  year: string;
  selectPaths: string;
  path: string | null;
};

export interface CoverageFileFormProps {
  file: string | CoverageFile;
  isOpen: boolean;
  onClose: () => void;
}

export function CoverageFileForm({ isOpen, onClose, file }: CoverageFileFormProps) {
  const isUpdate = file && typeof file !== "string";

  const [startProcessing, setStartProcessing] = React.useState<ProcessAction | null>(null);
  const [paths, setPaths] = React.useState<string[] | null>(null);
  const providerOptions = useProviderOptions();
  const coverageTypeOptions = useCoverageTypeOptions();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (!data.id) {
      let fileID = await addCoverageFile({
        provider: data.provider,
        coverage_type: data.coverageType,
        importPaths: data.selectPaths,
        year: data.year,
        status: "working",
        created_at: Date.now()
      });
      setValue("id", fileID as number);
      console.log("New file with ID", fileID);
      console.log("Start processing");
      setStartProcessing({
        paths: data.selectPaths.split(","),
        targetName: `${data.provider}_${data.coverageType}_${data.year}`
      });
    } else {
      let success = await updateCoverageFile(data.id, {
        provider: data.provider,
        coverage_type: data.coverageType,
        year: data.year
      });
      console.log("Update success?", success);
    }
  };

  const onProcessResult = async (result: ProcessResult) => {
    if (result.success) {
      let fileID = getValues("id");
      await updateCoverageFile(fileID, {
        status: "done",
        path: result.path
      });
      onClose();
    } else {
      console.error("Process error", result.error);
    }
  };

  const onCancel = () => {
    reset();
    setStartProcessing(null);
    onClose();
  };

  React.useEffect(() => {
    if (paths) {
      setValue("selectPaths", paths.join(","));
    } else {
      setValue("selectPaths", null);
    }
  }, [paths]);

  React.useEffect(() => {
    if (file && typeof file !== "string" && providerOptions.length && coverageTypeOptions.length) {
      reset({
        id: file.id,
        provider: file.provider,
        coverageType: file.coverage_type,
        year: file.year,
        path: file.path
      });
    }
  }, [providerOptions, coverageTypeOptions]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onCancel} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Nieuwe Dekkingskaart</DrawerHeader>

        <DrawerBody>
          <FormContainer animate={{ opacity: startProcessing ? 0.6 : 1 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register("id")} />
              <FormControl id="provider" isRequired mb={4} isInvalid={!!errors.provider}>
                <FormLabel>Provider</FormLabel>
                <Select {...register("provider", { required: true })}>
                  <option value="">Kies een Provider</option>
                  {providerOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
                {errors.provider && <FormErrorMessage>Dit veld is verplicht</FormErrorMessage>}
              </FormControl>
              <FormControl id="coverageType" isRequired mb={4} isInvalid={!!errors.coverageType}>
                <FormLabel>Type</FormLabel>
                <Select {...register("coverageType", { required: true })}>
                  <option value="">Kies een Dekkingstype</option>
                  {coverageTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
                {errors.coverageType && <FormErrorMessage>Dit veld is verplicht</FormErrorMessage>}
              </FormControl>
              <FormControl id="year" isRequired mb={4} isInvalid={!!errors.year}>
                <FormLabel>Jaar</FormLabel>
                <Input {...register("year", { required: true })} />
                {errors.year && <FormErrorMessage>Dit veld is verplicht</FormErrorMessage>}
              </FormControl>
              <FormControl id="paths" isRequired mb={4} isInvalid={!!errors.selectPaths}>
                <FormLabel>Bestand(en)</FormLabel>
                <Input type="hidden" {...register("selectPaths", { required: isUpdate ? !!!file.path : true })} />
                {paths && paths.map((path, index) => <p key={index}>{path}</p>)}
                <FileSelector
                  onSelect={(paths) => {
                    setPaths(paths);
                  }}
                />
                {errors.selectPaths && <FormErrorMessage>Dit veld is verplicht</FormErrorMessage>}
              </FormControl>
            </form>
          </FormContainer>

          {startProcessing && <ProcessFile action={startProcessing} onResult={onProcessResult} />}
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onCancel}>
            Annuleren
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit(onSubmit)}>
            Bestand toevoegen
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const _FormContainer = styled.div``;
const FormContainer = motion(_FormContainer);
