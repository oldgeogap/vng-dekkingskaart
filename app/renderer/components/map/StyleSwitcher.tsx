import { Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { MapStyle } from "./MapRenderer";
import { FaMap } from "react-icons/fa";

export interface StyleSwitcherProps {
  mapStyles: MapStyle[];
  setMapStyle: React.Dispatch<React.SetStateAction<MapStyle>>;
  activeMapStyle: MapStyle;
}

export function StyleSwitcher({ mapStyles, setMapStyle, activeMapStyle }: StyleSwitcherProps) {
  return (
    <StyleSwitcherContainer>
      <Menu>
        <MenuButton as={StyleButton}>
          <FaMap size={12} />
        </MenuButton>
        <MenuList>
          {mapStyles.map((style) => (
            <MenuItem
              key={style.label}
              onClick={() => {
                setMapStyle(style);
              }}
            >
              {style.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </StyleSwitcherContainer>
  );
}

const StyleSwitcherContainer = styled.div`
  position: absolute;
  right: 52px;
  top: 11px;
  z-index: 999;
`;

const StyleButton = styled.button`
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0%;
  border: none;

  svg {
    margin-left: 6px;
  }
`;
