import * as React from "react";
import { MapImage } from "renderer/components/map/render/useMapRenderImage";
import { CoverageFile } from "renderer/db";
import { CoveragePointEntry } from "renderer/hooks/useCoveragePoints";
import { LocationPoint } from "renderer/types";

export interface DownloadCSVProps {
  filename: string;
  onDone: () => void;
  providerName: (id: string | number) => string;
  coverageTypeName: (id: string | number) => string;
  coverageFiles: CoverageFile[];
  entries: CoveragePointEntry[];
  points: LocationPoint[];
  images: MapImage[];
}

export function LocationCheckDownloadCSV(props: DownloadCSVProps) {
  const [url, setUrl] = React.useState(null);
  const ref = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    const action = async (props: DownloadCSVProps) => {
      let output = makeCSV(props);

      try {
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        setUrl(fileDownloadUrl);
      } catch (err) {
        console.error(err);
      }
    };

    action(props);
  }, [props]);

  React.useEffect(() => {
    if (url) {
      ref.current.click();
      setUrl(null);
      props.onDone();
    }
  }, [url]);

  return (
    <>
      <a style={{ display: "none" }} download={`${props.filename}.csv`} href={url} ref={ref}>
        download
      </a>
    </>
  );
}

function makeCSV({ images, entries, points, coverageFiles, providerName, coverageTypeName }: DownloadCSVProps) {
  const covFile = (id: number | string) => {
    let index = coverageFiles.findIndex((f) => f.id == id);
    if (index > -1) {
      let cf = coverageFiles[index];
      return { cf, index };
    }
    return { cf: null, index: -1 };
  };

  let result = ["index;provider;dekkingskaart;versie;dekking;punt;x;y"];
  images.forEach((image, n) => {
    let [entryIndex, pointIndex] = image.id.split("x").map((s) => parseInt(s, 10));
    let entry = entries[entryIndex];
    let point = entry.points[pointIndex];
    let pointName = points[pointIndex];
    let { cf, index } = covFile(entry.id);

    result.push(
      [
        n + 1,
        providerName(cf.provider),
        coverageTypeName(cf.coverage_type),
        cf.year,
        point.hasCoverage ? "dekking" : "geen dekking",
        pointName.displayName,
        point.x,
        point.y
      ].join(";")
    );
  });

  return result.join("\n");
}
