import * as React from "react";
import { styled } from "../theme";
import { VscChevronDown } from "react-icons/vsc";
import { SortDirection } from "renderer/types";
import classNames from "classnames";
export interface SortHeaderProps {
  dir: SortDirection;
  active: boolean;
  toggle: (newDir: SortDirection) => void;
  children: React.ReactNode;
}

export function SortHeader({ active, dir, toggle, children }: SortHeaderProps) {
  return (
    <Th
      className={classNames({
        active,
        asc: dir === "asc"
      })}
      onClick={() => {
        toggle(dir === "asc" ? "desc" : "asc");
      }}
    >
      <label>{children}</label>

      <DirIcon
        className={classNames({
          asc: dir === "asc",
          visible: active
        })}
      >
        <VscChevronDown />
      </DirIcon>
    </Th>
  );
}

const Th = styled.th`
  &.active {
    color: ${(props) => props.theme.colors.brand[500]};
  }

  label {
    cursor: n-resize;
  }
  &.asc {
    label {
      cursor: s-resize;
    }
  }
`;

const DirIcon = styled.div`
  display: inline-block;
  margin-left: 4px;

  &.visible {
    svg {
      opacity: 1;
    }
  }
  svg {
    opacity: 0;
    transition: all 300ms ease-in-out;
  }
  &.asc {
    svg {
      transform: rotate(180deg);
    }
  }
`;
