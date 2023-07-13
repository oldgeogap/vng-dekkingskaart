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
          <p>Op basis van gemeentegrenzen 2023 van het CBS.</p>

          <h3>De gemeentegrenzen in de app zijn als volgt tot stand gekomen:</h3>
          <ol>
            <li>
              Gedownload van{" "}
              <a
                href="https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2023"
                target="_blank"
              >
                CBS
              </a>
            </li>
            <li>Unzip bestand</li>
            <li>Voeg gemeente_2023_v1.shp toe aan QGIS</li>
            <li>In QGIS gedissolved op GM_CODE en GM_NAAM</li>
            <li>Rename GM_CODE naar "id", rename GN_NAAM naar "name"</li>
            <li>Sorteer het bestand op de kolom "name" met de tool "Order by expression"</li>
            <li>Voeg een kolom toe "area" en bereken deze met Field Calculator ($area)</li>
            <li>Save as Geojson, EPSG:4326 (Geometrie = MultiPolygon)</li>
          </ol>

          <Bron>
            Bron:{" "}
            <a
              href="https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2023"
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

  h3 {
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 24px;
  }

  ol {
    margin-left: 16px;
  }
`;

const Bron = styled.p`
  font-size: 12px;
  margin-top: 8px;
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
