import { Box, Heading } from "@chakra-ui/layout";
import styled from "@emotion/styled";
import React from "react";

import Layout from "renderer/components/Layout";
import { MunicipalityAreas } from "renderer/components/municipality/MunicipalityAreas";

function VersionPage() {
  return (
    <Layout title="VNG Dekkingskaart Versie informatie">
      <Container>
        <Box p="32px">
          <VersionHeader>
            VNG Dekkingskaarten <span>v{process.env.VERSION}</span>
          </VersionHeader>
          <p>Op basis van gemeentegrenzen 2022 van het CBS.</p>
          <Bron>
            Bron:{" "}
            <a
              href="https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/cbs-gebiedsindelingen"
              target="_blank"
            >
              cbs.nl
            </a>
          </Bron>
          <p>Calculaties op basis van WSG84</p>
          <Bron>
            Bron:{" "}
            <a href="https://turfjs.org/" target="_blank">
              Turf.js
            </a>
          </Bron>
        </Box>
        <Box p="32px">
          <Heading as="h3" size="md">
            Oppervlaktes
          </Heading>
          <MunicipalityAreas />
        </Box>
      </Container>
    </Layout>
  );
}

export default VersionPage;

const Container = styled.div`
  flex: 1;
  overflow: auto;

  p {
    margin-bottom: 24px;
  }
`;

const Bron = styled.p`
  font-size: 12px;
  margin-top: -18px;
`;
const VersionHeader = styled.h2`
  font-weight: bold;
  font-size: 32px;
  display: flex;
  justify-content: space-between;

  span {
    color: ${(props) => props.theme.colors.brand[400]};
  }
`;
