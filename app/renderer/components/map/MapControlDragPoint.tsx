import { IconButton } from "@chakra-ui/react";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { MdAddLocation } from "react-icons/md";
import { DragPoint } from "./DragPoint";
import { VscClose } from "react-icons/vsc";

export interface MapControlDragPointProps {
  onDragEnd: (x: number, y: number) => void;
}

export function MapControlDragPoint({ onDragEnd }: MapControlDragPointProps) {
  const [show, setShow] = React.useState(false);

  const toggle = () => setShow((c) => !c);
  return (
    <MapControlDragPointContainer>
      <IconButton aria-label="toggle" icon={show ? <VscClose /> : <MdAddLocation />} onClick={toggle} />
      {show && <DragPoint onDragEnd={onDragEnd} />}
    </MapControlDragPointContainer>
  );
}

const MapControlDragPointContainer = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
`;
