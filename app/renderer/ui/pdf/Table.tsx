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
}

const DHS = StyleSheet.create({
  table: {},
  row: {
    display: "flex",
    flexDirection: "row"
  },
  col: {
    flex: 1
  },
  colh: {
    flex: 1,
    marginBottom: "4px"
  },
  th: {
    fontWeight: "bold",
    fontSize: "10px"
  },
  td: {
    fontSize: "10px"
  }
});
export function DoubleHeadTable({ rows, cols, data }: DoubleHeadTableProps) {
  return (
    <View style={DHS.table}>
      <View style={DHS.row}>
        <View style={DHS.col}></View>
        {cols.map((col, c) => (
          <View key={c} style={DHS.colh}>
            <Text style={styles.th}>{col}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, r) => (
        <View key={r} style={DHS.row}>
          <View style={DHS.col}>
            <Text style={styles.th}>{row}</Text>
          </View>
          {data[r].map((cell, c) => (
            <View key={c} style={DHS.col}>
              <Text style={DHS.td}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
