import { useRouter } from "next/router";
import React from "react";
import { RandomizerResult } from "renderer/components/randomizer/RandomizerResult";
import { LocationPoint } from "renderer/types";

export default function RandomizerResultPage() {
  const router = useRouter();
  const ids = router.query.ids || [];

  if (ids.length === 3) {
    let points: LocationPoint[] = ids[0]
      .split("x")
      .map((p) => p.split(",").map((s) => parseFloat(s)))
      .map((p) => ({ x: p[0], y: p[1] }));

    let munis = ids[1].split(",");
    let covs = ids[2].split(",").map((cov) => parseInt(cov, 10));

    return <RandomizerResult points={points} municipalityIds={munis} coverageFileIds={covs} />;
  }
  return <p>Error, missing parameters</p>;
}
