import React from "react";
import { CoverageHome } from "renderer/components/coverage/CoverageHome";

import Layout from "renderer/components/Layout";

function CoveragePage() {
  return (
    <Layout title="VNG Dekkingskaart">
      <CoverageHome />
    </Layout>
  );
}

export default CoveragePage;
