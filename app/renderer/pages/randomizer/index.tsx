import React from "react";

import Layout from "renderer/components/Layout";
import { RandomizerHome } from "renderer/components/randomizer/RandomizerHome";

function RandomizerPage() {
  return (
    <Layout title="VNG Dekkingskaart - Randomizer">
      <RandomizerHome />
    </Layout>
  );
}

export default RandomizerPage;
