import * as React from "react";
import { SortDirection } from "renderer/types";
import { CoverageFile, db } from "../db";
import { useLiveQuery } from "./useLiveQuery";

export type CoverageFileSortKey = keyof CoverageFile;
export type CoverageFileSort = [CoverageFileSortKey, SortDirection];
export type CoverageFileFilters = {
  providerId: number;
  coverageTypeId: number;
  year: string;
};
export interface UseFileListParams {
  sortBy: CoverageFileSort;
  filters: CoverageFileFilters | null;
}

export interface UseFileListReturn {
  files: CoverageFile[];
}

export function useFileList({ sortBy, filters }: UseFileListParams): UseFileListReturn {
  const _files = useLiveQuery(() => {
    if (sortBy[1] === "desc") {
      return db.coveragefile.toCollection().sortBy(sortBy[0]);
    }
    return db.coveragefile.toCollection().reverse().sortBy(sortBy[0]);
  }, [sortBy]);

  const files = React.useMemo(() => {
    if (_files) {
      if (filters) {
        let result = _files;
        if (filters.providerId) {
          result = result.filter((f) => f.provider === filters.providerId);
        }
        if (filters.coverageTypeId) {
          result = result.filter((f) => f.coverage_type === filters.coverageTypeId);
        }

        if (filters.year) {
          result = result.filter((f) => f.year.toLowerCase().indexOf(filters.year.toLowerCase()) > -1);
        }
        return result;
      }
      return _files;
    }
    return [];
  }, [_files, filters]);

  return {
    files
  };
}
