import { useDisclosure } from "@chakra-ui/hooks";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody } from "@chakra-ui/react";
import * as React from "react";
import { CoverageFile } from "renderer/db";
import { CoverageCalculate } from "./CoverageCalculate";

export interface CoverageCalculateModalProps {
  file: CoverageFile;
}

export function CoverageCalculateModal({ file }: CoverageCalculateModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant="ghost" size="xs" onClick={onOpen}>
        bereken
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Landelijke dekking</ModalHeader>
          <ModalBody>{isOpen && <CoverageCalculate file={file} onDone={onClose} />}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
