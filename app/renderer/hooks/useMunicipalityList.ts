import * as React from "react";
import Fuse from "fuse.js";
import { db, Municipality } from "renderer/db";

const fuseOptions: Fuse.IFuseOptions<any> = {
  keys: ["name"]
};

export interface UseMunicipalityListReturn {
  municipalities: Municipality[];
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
}

export interface UseMunicipalityListParams {}

export function useMunicipalityList({}: UseMunicipalityListParams): UseMunicipalityListReturn {
  const [initial, setInitial] = React.useState<Municipality[]>([]);
  const [result, setResult] = React.useState<Municipality[] | null>(null);
  const [searchKey, setSearchKey] = React.useState<string>("");

  const fuse = React.useMemo(() => {
    return new Fuse(initial, fuseOptions);
  }, [initial]);

  React.useEffect(() => {
    const action = async () => {
      let result = await db.municipality.toCollection().sortBy("name");
      setInitial(result);
    };
    action();
  }, []);

  React.useEffect(() => {
    if (searchKey.length > 2) {
      let result = fuse.search(searchKey);
      setResult(result.map((r) => r.item));
    } else {
      setResult(null);
    }
  }, [searchKey]);

  return {
    municipalities: result !== null ? result : initial,
    searchKey,
    setSearchKey
  };
}
