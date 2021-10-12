import React from "react";

import Layout from "renderer/components/Layout";
import { CoverageHome } from "renderer/components/coverage/CoverageHome";

function Home() {
  return (
    <Layout title="VNG Dekkingskaart">
      <CoverageHome />
    </Layout>
  );
}

export default Home;
