import * as React from "react";

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { styles } from "./pdfTheme";

export const Table: React.FC = ({ children }) => (
  <View
    style={{
      width: "100%"
    }}
  >
    {children}
  </View>
);

export const Row: React.FC = ({ children }) => (
  <View
    // @ts-ignore
    style={{
      borderBottom: "1pt solid black",
      borderRight: "1pt solid black",
      borderLeft: "1pt solid black",
      borderTop: "1pt solid black",
      width: "100%",
      display: "flex",
      flexDirection: "row"
    }}
  >
    {children}
  </View>
);

export const Cell: React.FC = ({ children }) => (
  <View
    style={{
      flex: 1,
      // @ts-ignore
      justifyContent: "stretch",
      textAlign: "left",
      fontSize: 14,
      borderRight: "1pt solid black",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap"
    }}
  >
    <Text>{children}</Text>
  </View>
);

export interface DoubleHeadTableProps {
  rows: string[];
  cols: string[];
  data: string[][];
  maxCols?: number;
}

const DHS = StyleSheet.create({
  table: {
    marginBottom: 32
  },
  row: {
    display: "flex",
    flexDirection: "row"
  },
  rowh: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 16,
    paddingBottom: 4,
    borderBottom: "1px solid #eee"
  },
  col: {
    flex: 1,
    paddingTop: 4,
    borderBottom: "1px solid #eee",
    borderRight: "1px solid #eee",
    paddingBottom: 4,
    textAlign: "center"
  },
  spacer: {
    flex: 1,
    paddingRight: 16,
    marginBottom: "4px",
    borderBottom: "1px solid transparent"
  },
  colh: {
    flex: 1,
    marginBottom: "4px",
    textAlign: "center",
    borderBottom: "1px solid black"
  },
  th: {
    fontWeight: "bold",
    fontSize: "8px"
  },
  thPos: {
    fontWeight: "bold",
    fontSize: "10px"
  },
  thNeg: {
    fontWeight: "bold",
    fontSize: "10px"
  },
  td: {
    fontSize: "10px"
  }
});

export function DoubleHeadTable({ rows, cols, data, maxCols = 7 }: DoubleHeadTableProps) {
  let tables = [];

  let colsLength = cols.length;
  for (let i = 0; i < colsLength; i += maxCols) {
    let t = {
      rows,
      cols: fillUp(cols.slice(i, i + maxCols), maxCols),
      data: data.map((row) => fillUp(row.slice(i, i + maxCols), maxCols))
    };

    tables.push(t);
  }

  return (
    <>
      {tables.map((t, tableIndex) => (
        <View style={DHS.table} key={tableIndex}>
          <View style={DHS.row}>
            <View style={DHS.spacer}></View>
            {t.cols.map((col, c) => {
              return (
                <View key={c} style={DHS.colh}>
                  <Text style={DHS.td}>{col}</Text>
                </View>
              );
            })}
          </View>

          {t.rows.map((row, r) => (
            <View key={r} style={DHS.row}>
              <View style={DHS.rowh}>
                <Text style={DHS.th}>{row}</Text>
              </View>
              {t.data[r].map((cell, c) => (
                <View key={c} style={DHS.col}>
                  <Text style={posNegStyle(cell)}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </>
  );
}

function fillUp(arr: string[], length: number): string[] {
  let result = [...arr];

  for (let i = 0; i < length - arr.length; i++) {
    result.push(" ");
  }

  return result;
}

function posNegStyle(s: string): any {
  let result = {
    fontWeight: "bold",
    fontSize: "10px",
    color: "black"
  };

  if (s.toUpperCase() === "NEE") {
    result.color = "red";
  } else if (s.toUpperCase() === "JA") {
    result.color = "green";
  }
  return result;
}
