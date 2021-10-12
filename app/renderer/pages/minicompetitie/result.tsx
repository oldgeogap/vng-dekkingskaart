import React from "react";
import Head from "next/head";
import { MiniCompetitionResult } from "renderer/components/minicompetition/MiniCompetitionResult";

function Next() {
  return (
    <React.Fragment>
      <Head>
        <title>Minicompetitie resultaat</title>
      </Head>
      <MiniCompetitionResult />
    </React.Fragment>
  );
}

export default Next;
