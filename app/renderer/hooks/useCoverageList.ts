import * as React from "react";
import Fuse from "fuse.js";
import { db, CoverageFile } from "renderer/db";
import { useApp } from "renderer/components/provider/AppProvider";

const fuseOptions: Fuse.IFuseOptions<any> = {
  keys: ["providerName", "coverageTypeName", "year"]
};

export interface UseCoverageListReturn {
  coverageFiles: CoverageFile[];
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
}

export interface UseCoverageListParams {}

export function useCoverageList({}: UseCoverageListParams): UseCoverageListReturn {
  const { coverageTypeOptions, providerOptions, providerName, coverageTypeName } = useApp();
  const [initial, setInitial] = React.useState<CoverageFile[]>([]);
  const [result, setResult] = React.useState<CoverageFile[] | null>(null);
  const [searchKey, setSearchKey] = React.useState<string>("");

  const fuse = React.useMemo(() => {
    console.log(initial);
    return new Fuse(initial, fuseOptions);
  }, [initial]);

  React.useEffect(() => {
    const action = async () => {
      let result = await db.coveragefile.toCollection().sortBy("name");
      setInitial(
        result.map((item) => ({
          ...item,
          providerName: providerName(item.provider),
          coverageTypeName: coverageTypeName(item.coverage_type)
        }))
      );
    };
    action();
  }, []);

  React.useEffect(() => {
    if (searchKey.length >= 2) {
      let result = fuse.search(searchKey);
      setResult(result.map((r) => r.item));
    } else {
      setResult(null);
    }
  }, [searchKey]);

  return {
    coverageFiles: result !== null ? result : initial,
    searchKey,
    setSearchKey
  };
}
