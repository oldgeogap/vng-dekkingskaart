import { useToast } from "@chakra-ui/toast";
import { IconButtonProps } from "@chakra-ui/react";
import * as React from "react";
import { CoverageFile, db } from "renderer/db";
import { DeleteFileResult, useDeleteFile } from "renderer/hooks/useDeleteFile";
import { ConfirmIconButton } from "renderer/ui/confirm";

export interface DeleteFileButtonProps extends Omit<IconButtonProps, "onClick"> {
  file: CoverageFile;
}

export function DeleteFileButton({ file, ...buttonProps }: DeleteFileButtonProps) {
  const [deleting, setDeleting] = React.useState(false);
  const toast = useToast();
  const { deleteFile, result, loading } = useDeleteFile();

  const done = () => {
    setDeleting(false);
    toast({
      title: `Bestand verwijderd`,
      description: `${file.path || ""}`,
      status: "success"
    });
  };

  React.useEffect(() => {
    const action = async () => {
      try {
        if (file.path) {
          deleteFile(file.path);
        } else {
          await db.coveragefile.delete(file.id);
          done();
        }
      } catch (err) {
        console.error("Delete file error", err);
      }
    };
    if (deleting) {
      action();
    }
  }, [deleting, file]);

  React.useEffect(() => {
    const action = async (result: DeleteFileResult) => {
      if (result.success) {
        await db.coveragefile.delete(file.id);
      } else {
        console.log("Delete error", result.error);
        await db.coveragefile.delete(file.id);
      }
      done();
    };
    if (result) {
      action(result);
    }
  }, [result]);

  return (
    <>
      <ConfirmIconButton
        title="Dekkingskaart verwijderen"
        description="bla"
        isLoading={deleting}
        onClick={() => setDeleting(true)}
        {...buttonProps}
      />
    </>
  );
}
