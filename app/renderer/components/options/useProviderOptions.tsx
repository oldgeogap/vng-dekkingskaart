import * as React from "react";
import { db } from "../../db";
import { Option } from ".";

export function useProviderOptions() {
  const [providerOptions, setProviderOptions] = React.useState([]);

  React.useEffect(() => {
    const doFetch = async () => {
      let result = await db.provider.toCollection().reverse().sortBy("name");
      setProviderOptions(result.map((r) => ({ id: r.id, name: r.name })));
    };
    doFetch();
  }, []);

  return providerOptions;
}
