import React from "react";
import Link from "next/link";
import Layout from "renderer/components/Layout";
import { Test } from "renderer/components/Test";

function Home() {
  return (
    <Layout title="VNG Dekkingskaart">
      <Test />
    </Layout>
  );
}

export default Home;
