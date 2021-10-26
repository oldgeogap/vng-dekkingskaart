import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger
} from "@chakra-ui/react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { VscSearch } from "react-icons/vsc";
import { LookupResult, useGeocoder } from "renderer/hooks/useGeocoder";
import { styled } from "renderer/ui/theme";

export type GeocoderInputs = {
  query: string;
};

export interface GeocoderProps {
  onResult: (r: LookupResult) => void;
}

export function Geocoder({ onResult }: GeocoderProps) {
  const { loading, doQuery, clear, suggestResult, doLookup, lookupResult } = useGeocoder({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<GeocoderInputs>();

  React.useEffect(() => {
    if (lookupResult) {
      onResult(lookupResult);
    }
  }, [lookupResult]);

  const onClose = () => {
    clear();
  };

  const onSubmit: SubmitHandler<GeocoderInputs> = async (data) => {
    doQuery(data.query);
  };

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={suggestResult !== null}
      onClose={onClose}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup size="sm">
            <Input
              variant="filled"
              minWidth="200px"
              placeholder="adres, postcode of plaats..."
              type="text"
              {...register("query", { required: true })}
              _focus={{ bg: "white" }}
            />
            <InputRightAddon
              children={
                <IconButton aria-label="zoeken" type="submit" size="sm" icon={<VscSearch />} isLoading={loading} />
              }
            />
          </InputGroup>
        </form>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody p="0">
          <SuggestResultContainer>
            <Suggestions>
              <ul>
                {suggestResult?.items.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      doLookup(item.id);
                      reset();
                      onClose();
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </Suggestions>
            {suggestResult?.alternatives.length > 0 && (
              <Alternatives>
                <ul>
                  {suggestResult?.alternatives.map((item, index) => (
                    <li key={index}>
                      {item.name}
                      <ul>
                        {item.suggestions.map((sug, index2) => (
                          <li key={index2}>{sug}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </Alternatives>
            )}
          </SuggestResultContainer>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const SuggestResultContainer = styled.div`
  display: flex;
`;

const Suggestions = styled.section`
  flex: 1 1 auto;
  padding-top: 8px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      cursor: pointer;
      padding: 8px 16px 8px 16px;
      border-bottom: 1px solid ${(props) => props.theme.colors.gray[100]};

      &:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
      }

      &:hover {
        background-color: ${(props) => props.theme.colors.bg[50]};
      }
    }
  }
`;

const Alternatives = styled.section`
  padding: 16px 0 16px 16px;
  flex: 0 0 100px;
  border-left: 1px solid ${(props) => props.theme.colors.gray[300]};

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 12px;
    li {
      font-weight: bold;
      ul {
        li {
          font-weight: normal;
        }
      }
    }
  }
`;
