import * as React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { Confirm } from "./Confirm";

export interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  title: string;
  description: string;
  onClick: () => void;
  children: React.ReactNode;
}

export function ConfirmButton({ title, description, onClick, children, ...buttonProps }: ConfirmButtonProps) {
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
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        {...buttonProps}
      >
        {children}
      </Button>
      <Confirm title={title} description={description} onConfirm={onConfirm} onCancel={onCancel} isOpen={isOpen} />
    </>
  );
}
