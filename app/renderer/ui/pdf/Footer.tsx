import * as React from "react";
import { View, Text } from "@react-pdf/renderer";

export interface FooterProps {
  pageNumber: number;
  totalPages: number;
}

export const Footer: React.FC<FooterProps> = ({ pageNumber, totalPages }) => {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        left: 0,
        bottom: 10,
        margin: "0 16px 0 16px",
        borderTop: "1px solid #d6d8da"
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: "8px",
          color: "#68727d"
        }}
      >
        Pagina {pageNumber} / {totalPages}
      </Text>
    </View>
  );
};
