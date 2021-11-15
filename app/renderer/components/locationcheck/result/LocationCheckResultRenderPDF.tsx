import * as React from "react";
import { pdf, Page, Text, View, Document, StyleSheet, Image, Link } from "@react-pdf/renderer";
import {
  VNGPage,
  Flex,
  FlexCol,
  ColHeader,
  PropText,
  DoubleHeadTable,
  BoolLabel,
  Header,
  SubHeader,
  Footer,
  styles
} from "renderer/ui/pdf";
import { CoverageFile, Municipality } from "renderer/db";
import { CoveragePointEntry } from "renderer/hooks/useCoveragePoints";
import { LocationPoint } from "renderer/types";
import { MapImage } from "renderer/components/map/render/useMapRenderImage";
import { formatDate } from "renderer/util";

export interface LocationCheckResultRenderPDFProps {
  providerName: (id: string | number) => string;
  coverageTypeName: (id: string | number) => string;
  coverageFiles: CoverageFile[];
  entries: CoveragePointEntry[];
  points: LocationPoint[];
  images: MapImage[];
}

const _perTable = 5;

export function LocationCheckResultRenderPDF({
  providerName,
  coverageTypeName,
  coverageFiles,
  entries,
  points,
  images
}: LocationCheckResultRenderPDFProps) {
  const covFile = (id: number | string) => {
    let index = coverageFiles.findIndex((f) => f.id == id);
    if (index > -1) {
      let cf = coverageFiles[index];
      return { cf, index };
    }
    return { cf: null, index: -1 };
  };

  return (
    <Document>
      <VNGPage>
        <View style={{ marginBottom: "64px" }}>
          <Text style={styles.docpreheader}>{formatDate(new Date())}</Text>
          <Text style={styles.docheader}>Locatie check</Text>
        </View>
        <Flex mb={32}>
          <FlexCol>
            <ColHeader>DEKKINGSKAARTEN</ColHeader>

            {coverageFiles.map((c) => (
              <PropText key={c.id}>
                {`${providerName(c.provider)} ${coverageTypeName(c.coverage_type)} ${c.year}`}
              </PropText>
            ))}
          </FlexCol>
          <FlexCol>
            <ColHeader>{points.length} PUNTEN</ColHeader>
            {points.map((p, n) => (
              <PropText key={n} small>
                {n + 1} {p.displayName}
              </PropText>
            ))}
          </FlexCol>
        </Flex>
        <DoubleHeadTable
          rows={entries.map((entry) => {
            let { cf, index } = covFile(entry.id);
            if (cf) {
              return `${providerName(cf.provider)} ${coverageTypeName(cf.coverage_type)} ${cf.year}`;
            }
            return "";
          })}
          cols={points.map((p, i) => `${i + 1}`)}
          data={entries.map((entry) => {
            return entry.points.map((p) => (p.hasCoverage ? "JA" : "NEE"));
          })}
        />
        <Footer totalPages={images.length + 1} pageNumber={1} />
      </VNGPage>
      {images.map((image, n) => {
        let [entryIndex, pointIndex] = image.id.split("x").map((s) => parseInt(s, 10));
        let entry = entries[entryIndex];
        let point = entry.points[pointIndex];
        let pointName = points[pointIndex];
        let { cf, index } = covFile(entry.id);
        return (
          <VNGPage key={image.id}>
            <View>
              <Header>
                {providerName(cf.provider)} - {coverageTypeName(cf.coverage_type)} - {cf.year}
              </Header>
              <BoolLabel yes={!!point.hasCoverage}>Dekking op geselecteerde locatie</BoolLabel>
              {pointName.displayName && (
                <Text style={{ fontSize: 12, marginBottom: "4px" }}>{pointName.displayName}</Text>
              )}
              <SubHeader>
                Willekeurige locatie:{"  "}
                <Link src={`https://www.google.com/maps/@${point.y},${point.x},14z`}>
                  {point.x}, {point.y}
                </Link>
              </SubHeader>
            </View>
            <View style={{ marginTop: "16px" }}>
              <Image src={URL.createObjectURL(image.image)} />
            </View>
            <Footer totalPages={images.length + 1} pageNumber={n + 2} />
          </VNGPage>
        );
      })}
    </Document>
  );
}
