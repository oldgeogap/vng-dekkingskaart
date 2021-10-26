import { useRouter } from "next/router";
import React from "react";

import { LocationCheckResult } from "renderer/components/locationcheck/LocationCheckResult";
import { LocationPoint } from "renderer/types";

export default function MinicompetitieResultPage() {
  const router = useRouter();
  const ids = router.query.ids || [];

  if (ids.length === 2) {
    let points: LocationPoint[] = ids[0]
      .split("x")
      .map((p) => p.split(",").map((s) => parseFloat(s)))
      .map((p) => ({ x: p[0], y: p[1] }));
    let covs = ids[1].split(",").map((cov) => parseInt(cov, 10));

    return <LocationCheckResult points={points} coverageFileIds={covs} />;
  }
  return <p>Error, missing parameters</p>;
}
