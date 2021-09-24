import * as React from "react";
import { useBrowseFile, useDropFile } from "renderer/hooks";
import { styled } from "renderer/ui/theme";

export interface FileSelectorProps {
  onSelect: (paths: string[]) => void;
}

export function FileSelector({ onSelect }: FileSelectorProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { dragOver, paths: dropPaths } = useDropFile(ref);
  const { loading, browseFiles, paths: browsePaths } = useBrowseFile();

  React.useEffect(() => {
    let paths = dropPaths || browsePaths;
    if (paths) {
      onSelect(paths);
    }
  }, [dropPaths, browsePaths]);

  return (
    <DropTarget ref={ref} className={dragOver ? "highlight" : "idle"} onClick={() => browseFiles()}>
      Klik hier of Sleep bestanden hier naartoe
    </DropTarget>
  );
}

const DropTarget = styled.div`
  width: 100%;
  border-radius: 16px;

  height: 100px;
  background-color: ${(props) => props.theme.colors.bg[50]};
  border: 2px dashed ${(props) => props.theme.colors.bg[100]};

  display: flex;
  align-items: center;
  justify-content: space-around;

  &.highlight {
    background-color: yellow;
  }
`;
