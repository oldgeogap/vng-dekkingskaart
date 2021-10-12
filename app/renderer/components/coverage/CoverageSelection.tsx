import { InputGroup, Input, InputRightElement, IconButton, Checkbox } from "@chakra-ui/react";
import * as React from "react";
import { VscClose, VscEye, VscEyeClosed } from "react-icons/vsc";
import { CoverageFile } from "renderer/db";
import { useCoverageList } from "renderer/hooks/useCoverageList";
import { FilterSelection, Selection, Filters, Options, Option, OptionProp } from "renderer/ui/selection";
import { styled } from "renderer/ui/theme";
import { useApp } from "../provider/AppProvider";
import { useAppState } from "../provider/AppStateProvider";

export interface CoverageSelectionProps {
  coverageFileVisible: number[];
  setCoverageFileVisible: React.Dispatch<React.SetStateAction<number[]>>;
}

export function CoverageSelection({ coverageFileVisible, setCoverageFileVisible }: CoverageSelectionProps) {
  const { providerName, coverageTypeName } = useApp();
  const { coverageSelection, coverageSelect, coverageDeselect } = useAppState();
  const { coverageFiles, searchKey, setSearchKey } = useCoverageList({});

  console.log(coverageSelection);
  const selectedIDS = React.useMemo(() => coverageSelection.map((m) => m.id), [coverageSelection]);
  const isSelected = (id: number) => selectedIDS.includes(id);

  const toggleCoverageFile = (id: number) => {
    setCoverageFileVisible((prev) => {
      if (prev.includes(id)) {
        return prev.filter((m) => m !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <FilterSelection>
      <h2>Dekkingskaarten</h2>
      <Filters>
        <InputGroup>
          <Input
            type="text"
            variant="flushed"
            p="0 16px"
            placeholder="Zoek..."
            value={searchKey}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setSearchKey(e.currentTarget.value);
            }}
          />
          <InputRightElement
            children={
              <IconButton
                variant="ghost"
                aria-label="herstel"
                icon={<VscClose />}
                isRound
                size="xs"
                onClick={() => setSearchKey("")}
              />
            }
          />
        </InputGroup>
      </Filters>
      <Selection className="option-prop">
        {coverageSelection.map((cov) => (
          <Option key={cov.id}>
            <Checkbox
              id={`sel${cov.id}`}
              isChecked={isSelected(cov.id)}
              colorScheme="brand"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                if (e.currentTarget.checked) {
                  coverageSelect([cov]);
                } else {
                  coverageDeselect([cov.id]);
                }
              }}
            />
            <OptionProp onClick={() => coverageDeselect([cov.id])}>
              <h6>{providerName(cov.provider)} </h6>
              <p>
                {coverageTypeName(cov.coverage_type)} <span>{cov.year}</span>
              </p>
            </OptionProp>
            <IconButton
              aria-label="toggle dekkingskaart"
              icon={coverageFileVisible.includes(cov.id) ? <VscEye /> : <VscEyeClosed />}
              isRound
              size="xs"
              onClick={() => {
                toggleCoverageFile(cov.id);
              }}
            />
          </Option>
        ))}
      </Selection>

      <Options className="option-prop">
        {coverageFiles
          .filter((cov) => !selectedIDS.includes(cov.id))
          .map((cov) => (
            <Option key={cov.id}>
              <Checkbox
                id={`un${cov.id}`}
                colorScheme="brand"
                checked={isSelected(cov.id)}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  if (e.currentTarget.checked) {
                    coverageSelect([cov]);
                  } else {
                    coverageDeselect([cov.id]);
                  }
                }}
              />
              <OptionProp onClick={() => coverageSelect([cov])}>
                <h6>{providerName(cov.provider)}</h6>
                <p>
                  {coverageTypeName(cov.coverage_type)} <span>{cov.year}</span>
                </p>
              </OptionProp>
            </Option>
          ))}
      </Options>
    </FilterSelection>
  );
}
