import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import * as React from "react";
import { useMunicipalityAreas } from "renderer/hooks";

export function MunicipalityAreas() {
  const { data, loading, error } = useMunicipalityAreas();
  const [url, setUrl] = React.useState(null);
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    const action = async (data: any) => {
      let output = makeCSV(data);

      const blob = new Blob([output]);
      const fileDownloadUrl = URL.createObjectURL(blob);
      setUrl(fileDownloadUrl);
    };

    if (data && data.length) {
      action(data);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Button
        as="a"
        size="sm"
        margin="10px 0 20px 0"
        colorScheme="brand"
        download={`gemeente_oppervlaktes.csv`}
        href={url}
        ref={ref as any}
      >
        download CSV
      </Button>
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>naam</th>
            <th className="num">oppervlakte RD</th>
            <th className="num">oppervlakte WGS84</th>
            <th className="num">verschil</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m: any) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td className="num">{formatter.format(m.area)} m²</td>
              <td className="num">{formatter.format(m.area_calculated)} m²</td>
              <td className="num">{percent(m.area, m.area_calculated)}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

const Table = styled.table`
  width: 100%;
  th {
    text-align: left;
    padding: 8px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  td {
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 8px;

    &.num {
      font-family: monospace;
    }
  }

  .num {
    text-align: right;
  }
`;

let formatter = new Intl.NumberFormat("nl-NL");

function percent(a: number, b: number) {
  let pct = 1 - b / a;
  pct = pct * 100;

  return pct.toFixed(6);
}

function roundX(n: number, x: number) {
  return Math.round(n * x) / x;
}

function makeCSV(data) {
  let result = ["id;naam;oppervlakte_rd;oppervlakte_wsg84;verschil_procent"];
  data.forEach((m: any) => {
    result.push([m.id, m.name, m.area, m.area_calculated, percent(m.area, m.area_calculated)].join(";"));
  });

  return result.join("\n");
}
