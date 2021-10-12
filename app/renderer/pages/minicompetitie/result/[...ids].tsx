import { useRouter } from "next/router";
import React from "react";
import { MiniCompetitionResult } from "renderer/components/minicompetition/MiniCompetitionResult";

export default function MinicompetitieResultPage() {
  const router = useRouter();
  const ids = router.query.ids || [];

  if (ids.length === 2) {
    let munis = ids[0].split(",");
    let covs = ids[1].split(",").map((cov) => parseInt(cov, 10));

    return <MiniCompetitionResult municipalityIds={munis} coverageFileIds={covs} />;
  }
  return <p>Error, missing parameters</p>;
}
