import React from "react";

import Layout from "renderer/components/Layout";
import { MiniCompetitionHome } from "renderer/components/minicompetition/MiniCompetitionHome";

function MiniCompetitiePage() {
  return (
    <Layout title="VNG Dekkingskaart - Minicompetitie">
      <MiniCompetitionHome />
    </Layout>
  );
}

export default MiniCompetitiePage;
