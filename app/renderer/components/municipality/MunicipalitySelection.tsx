import { InputGroup, Input, InputRightElement, IconButton, Checkbox, Button, Center } from "@chakra-ui/react";
import * as React from "react";
import { VscClose } from "react-icons/vsc";
import { useMunicipalityList } from "renderer/hooks/useMunicipalityList";
import { FilterSelection, Selection, Filters, Options, Option } from "renderer/ui/selection";
import { styled } from "renderer/ui/theme";
import { useAppState } from "../provider/AppStateProvider";

export interface MunicipalitySelectionProps {}

export function MunicipalitySelection({}: MunicipalitySelectionProps) {
  const { municipalitySelection, municipalitySelect, municipalityDeselect } = useAppState();
  const { municipalities, searchKey, setSearchKey } = useMunicipalityList({});

  const selectedIDS = React.useMemo(() => municipalitySelection.map((m) => m.id), [municipalitySelection]);
  const isSelected = (id: string) => selectedIDS.includes(id);

  return (
    <FilterSelection>
      <h2>Gemeenten</h2>
      <Filters>
        <InputGroup>
          <Input
            type="text"
            variant="flushed"
            p="0 16px"
            placeholder="Gemeente naam..."
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
      <Selection className={municipalitySelection.length > 10 ? "over" : "default"}>
        {municipalitySelection.map((muni) => (
          <Option key={muni.id}>
            <Checkbox
              id={`sel${muni.id}`}
              isChecked={isSelected(muni.id)}
              colorScheme="brand"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                if (e.currentTarget.checked) {
                  municipalitySelect([muni]);
                } else {
                  municipalityDeselect([muni.id]);
                }
              }}
            >
              {muni.name}
            </Checkbox>
          </Option>
        ))}
        {municipalitySelection.length > 0 && (
          <Center mb={2} mt={2}>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => {
                municipalityDeselect(municipalitySelection.map((m) => m.id));
              }}
            >
              alles deselecteren
            </Button>
          </Center>
        )}
      </Selection>

      <Options>
        {municipalities
          .filter((muni) => !selectedIDS.includes(muni.id))
          .map((muni) => (
            <Option key={muni.id}>
              <Checkbox
                id={`un${muni.id}`}
                colorScheme="brand"
                checked={isSelected(muni.id)}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  if (e.currentTarget.checked) {
                    municipalitySelect([muni]);
                  } else {
                    municipalityDeselect([muni.id]);
                  }
                }}
              >
                {muni.name}
              </Checkbox>
            </Option>
          ))}
      </Options>
    </FilterSelection>
  );
}
