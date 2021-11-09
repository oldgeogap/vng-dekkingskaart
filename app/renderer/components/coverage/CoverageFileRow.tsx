import { Button, IconButton } from "@chakra-ui/react";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { findOptionName, formatTimestamp, formatTimestampDistance } from "renderer/util";
import { CoverageFile, db } from "../../db";
import { DeleteFileButton } from "./DeleteFileButton";
import { Option } from "renderer/components/options";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { CoverageCalculateModal } from "./CoverageCalculateModal";

export interface CoverageFileRowProps {
  file: CoverageFile;
  onEdit: (file: CoverageFile) => void;
  providerOptions: Option[];
  coverageTypeOptions: Option[];
}

export function CoverageFileRow({ file, providerOptions, coverageTypeOptions, onEdit }: CoverageFileRowProps) {
  return (
    <tr key={file.id}>
      <td className="dot">
        <Dot className={file.status} />
      </td>
      <td className="title">{findOptionName(providerOptions, file.provider)}</td>
      <td>{findOptionName(coverageTypeOptions, file.coverage_type)}</td>
      <td>{file.year}</td>
      <td className="created">
        <label>{formatTimestampDistance(file.created_at)}</label>
        <p>{formatTimestamp(file.created_at)}</p>
      </td>
      <td>
        {file.coveragePercent ? (
          <span>{file.coveragePercent.toFixed(2)}%</span>
        ) : (
          <CoverageCalculateModal file={file} />
        )}
      </td>

      <td className="actions">
        <IconButton aria-label="bewerken" size="sm" onClick={() => onEdit(file)} isRound icon={<VscEdit />} />
        <DeleteFileButton file={file} size="sm" aria-label="verwijderen" icon={<VscTrash />} isRound />
      </td>
    </tr>
  );
}

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
