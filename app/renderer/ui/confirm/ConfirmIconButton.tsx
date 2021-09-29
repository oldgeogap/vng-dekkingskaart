import * as React from "react";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { Confirm } from "./Confirm";

export interface ConfirmIconButtonProps extends Omit<IconButtonProps, "onClick"> {
  title: string;
  description: string;
  onClick: () => void;
}

export function ConfirmIconButton({ title, description, onClick, ...buttonProps }: ConfirmIconButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const onCancel = () => {
    setIsOpen(false);
  };

  const onConfirm = () => {
    setIsOpen(false);
    onClick();
  };

  return (
    <>
      <IconButton
        onClick={() => {
          setIsOpen(true);
        }}
        {...buttonProps}
      />
      <Confirm title={title} description={description} onConfirm={onConfirm} onCancel={onCancel} isOpen={isOpen} />
    </>
  );
}
