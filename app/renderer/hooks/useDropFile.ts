import * as React from "react";

export interface UseDropFileReturn {
  dragOver: boolean;
  paths: string[] | null;
}

export function useDropFile(ref: React.MutableRefObject<HTMLElement>): UseDropFileReturn {
  const [dragOver, setDragOver] = React.useState(false);
  const [paths, setPaths] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    const onDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      let _paths = [];
      for (const f of event.dataTransfer.files) {
        _paths.push(f.path);
      }
      setPaths(_paths);
      setDragOver(false);
    };

    const onDragOver = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onDragEnter = (e: any) => {
      console.log("File is in the Drop Space");
      setDragOver(true);
    };

    const onDragLeave = (e: any) => {
      console.log("File has left the Drop Space");
      setDragOver(false);
    };

    if (ref.current) {
      ref.current.addEventListener("drop", onDrop);
      ref.current.addEventListener("dragover", onDragOver);
      ref.current.addEventListener("dragenter", onDragEnter);
      ref.current.addEventListener("dragleave", onDragLeave);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("drop", onDrop);
          ref.current.removeEventListener("dragover", onDragOver);
          ref.current.removeEventListener("dragenter", onDragEnter);
          ref.current.removeEventListener("dragleave", onDragLeave);
        }
      };
    }
  }, [ref.current]);

  return {
    dragOver,
    paths
  };
}
