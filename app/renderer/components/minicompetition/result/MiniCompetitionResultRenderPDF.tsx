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
import { CoveragePercentEntry } from "renderer/hooks/useCoveragePercent";
import { formatDate, sortMunicipalities } from "renderer/util";

export interface MiniCompetitionResultRenderPDFProps {
  providerName: (id: string | number) => string;
  coverageTypeName: (id: string | number) => string;
  municipalities: Municipality[];
  coverageFiles: CoverageFile[];
  entries: CoveragePercentEntry[];
  images: MapImage[];
}

export function MiniCompetitionResultRenderPDF({
  providerName,
  coverageTypeName,
  coverageFiles,
  entries,
  municipalities,
  images
}: MiniCompetitionResultRenderPDFProps) {
  const providerIds = React.useMemo(() => {
    let s = new Set<number>();
    coverageFiles.forEach((cov) => s.add(cov.provider));
    return Array.from(s);
  }, [coverageFiles]);

  const coverageTypes = React.useMemo(() => {
    let s = new Set<number>();
    coverageFiles.forEach((cov) => s.add(cov.coverage_type));
    return Array.from(s);
  }, [coverageFiles]);

  const covFile = (id: number | string) => {
    let index = coverageFiles.findIndex((f) => f.id == id);
    if (index > -1) {
      let cf = coverageFiles[index];
      return { cf, index };
    }
    return { cf: null, index: -1 };
  };

  const getCoverageFileEntry = (covTypeId: number, providerId: number) => {
    let covFileId = coverageFiles.find((cov) => cov.coverage_type == covTypeId && cov.provider == providerId)?.id;
    if (covFileId) {
      let entry = entries.find((o) => o.id === `${covFileId}`);
      if (entry) {
        return entry;
      }
    }
    return null;
  };

  return (
    <Document>
      <VNGPage>
        <View style={{ marginBottom: "64px" }}>
          <Text style={styles.docpreheader}>{formatDate(new Date())}</Text>
          <Text style={styles.docheader}>Minicompetitie</Text>
        </View>
        <Flex mb={32}>
          <FlexCol>
            <ColHeader>GEMEENTE</ColHeader>
            {sortMunicipalities(municipalities).map((m) => (
              <PropText key={m.id}>{m.name}</PropText>
            ))}
          </FlexCol>
          <FlexCol>
            <ColHeader>DEKKINGSKAARTEN</ColHeader>

            {coverageFiles.map((c) => (
              <PropText key={c.id}>
                {`${providerName(c.provider)} ${coverageTypeName(c.coverage_type)} ${c.year}`}
              </PropText>
            ))}
          </FlexCol>
        </Flex>
        <DoubleHeadTable
          rows={coverageTypes.map((ct) => coverageTypeName(ct))}
          cols={providerIds.map((pid) => providerName(pid))}
          data={coverageTypes.map((ct) => {
            return providerIds.map((pid) => {
              let entry = getCoverageFileEntry(ct, pid);
              if (entry) {
                return formatNumber(entry.coveragePercent, "%");
              }
              return "-";
            });
          })}
        />
        <Footer totalPages={images.length + 1} pageNumber={1} />
      </VNGPage>
      {images.map((image, index) => {
        let cfId = parseInt(image.id, 10);
        let covFile = coverageFiles.find((c) => c.id === cfId);
        let entry = entries.find((o) => o.id == `${cfId}`);
        if (!entry) {
          console.log(cfId, entries);
        }

        return (
          <VNGPage key={image.id}>
            <View>
              <Header>
                {providerName(covFile.provider)} - {coverageTypeName(covFile.coverage_type)} - {covFile.year}
              </Header>
              <Text>Dekking in geselecteerde gemeente(n) {formatNumber(entry.coveragePercent, "%")}</Text>
              <SubHeader>
                Geselecteerde gemeenten:{"  "}
                {municipalities.map((m) => (
                  <React.Fragment key={m.id}>
                    <Link key={m.id} src={`https://maps.google.com/?q=${m.name}`}>
                      {m.name}
                    </Link>{" "}
                  </React.Fragment>
                ))}
              </SubHeader>
            </View>
            <View style={{ marginTop: "16px" }}>
              <Image src={URL.createObjectURL(image.image)} />
            </View>
            <Footer totalPages={images.length + 1} pageNumber={index + 2} />
          </VNGPage>
        );
      })}
    </Document>
  );
}

export const numberFormatter = new Intl.NumberFormat("nl-NL");
function formatNumber(num: number, unit: string) {
  if (num) {
    return `${numberFormatter.format(num)}${unit}`;
  }
  return "";
}
