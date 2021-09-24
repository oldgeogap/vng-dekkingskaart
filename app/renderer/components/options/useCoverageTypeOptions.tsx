import * as React from "react";
import { db } from "../../db";
import { Option } from ".";

export function useCoverageTypeOptions() {
  const [coverageTypes, setcoverageTypes] = React.useState<Option[]>([]);
  React.useEffect(() => {
    const doFetch = async () => {
      let result = await db.coveragetype.toCollection().reverse().sortBy("name");
      setcoverageTypes(result.map((r) => ({ id: r.id, name: r.name })));
    };
    doFetch();
  }, []);

  return coverageTypes;
}
