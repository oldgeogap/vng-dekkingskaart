import { Button } from "@chakra-ui/button";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { findOptionName, formatTimestamp, formatTimestampDistance } from "renderer/util";
import { CoverageFile, db } from "../../db";
import { useLiveQuery } from "../../hooks/useLiveQuery";
import { useCoverageTypeOptions } from "../options/useCoverageTypeOptions";
import { useProviderOptions } from "../options/useProviderOptions";

export interface FileListProps {
  onEdit: (file: CoverageFile) => void;
}

export function FileList({ onEdit }: FileListProps) {
  const _files = useLiveQuery(() => db.coveragefile.toCollection().reverse().sortBy("id"), []);

  const providerOptions = useProviderOptions();
  const coverageTypeOptions = useCoverageTypeOptions();

  let files = _files || [];
  return (
    <FileListContainer>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th></th>
            <th>id</th>
            <th>provider</th>
            <th>dekkingstype</th>
            <th>jaar</th>
            <th>aangemaakt</th>
            <th>status</th>
            <th>acties</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>
                <Dot className={file.status} />
              </td>
              <td>{file.id}</td>
              <td>{findOptionName(providerOptions, file.provider)}</td>
              <td>{findOptionName(coverageTypeOptions, file.coverage_type)}</td>
              <td>{file.year}</td>
              <td>
                {formatTimestampDistance(file.created_at)}
                <br />
                {formatTimestamp(file.created_at)}
              </td>
              <td>{file.status}</td>
              <td>
                <Button size="sm" onClick={() => onEdit(file)}>
                  edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </FileListContainer>
  );
}

const FileListContainer = styled.section`
  flex: 1 1 auto;
  padding: 32px;
`;

const Dot = styled.div`
  border-radius: 50%;
  width: 6px;
  height: 6px;
  background-color: gray;
  &.working {
    background-color: yellow;
  }
  &.done {
    background-color: green;
  }
  &.error {
    background-color: red;
  }
`;
