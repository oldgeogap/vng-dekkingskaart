import React from "react";

import Layout from "renderer/components/Layout";
import { LocationCheckHome } from "renderer/components/locationcheck/LocationCheckHome";

function LocatieCheckPage() {
  return (
    <Layout title="VNG Dekkingskaart">
      <LocationCheckHome />
    </Layout>
  );
}

export default LocatieCheckPage;
