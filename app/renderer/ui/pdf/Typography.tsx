import * as React from "react";

import { View, Text, Font } from "@react-pdf/renderer";

export const ColHeader: React.FC = ({ children }) => {
  return (
    <Text
      style={{
        color: "#00a1e6",
        fontSize: "10px",
        marginBottom: "8px"
      }}
    >
      {children}
    </Text>
  );
};

export const Header: React.FC = ({ children }) => {
  return (
    <View style={{ marginBottom: "4px" }}>
      <Text
        style={{
          color: "#00a1e6",
          fontSize: "16px"
        }}
      >
        {children}
      </Text>
    </View>
  );
};

export const SubHeader: React.FC = ({ children }) => {
  return (
    <Text
      style={{
        color: "#232629",
        fontSize: "12px"
      }}
    >
      {children}
    </Text>
  );
};

export interface BoolLabelProps {
  yes: boolean;
}
export const BoolLabel: React.FC<BoolLabelProps> = ({ yes, children }) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "16px" }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#80A2C4",
            fontSize: "12px"
          }}
        >
          {children}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: "12px",
            color: yes ? "#017e26" : "#974d3a"
          }}
        >
          {yes ? "JA" : "NEE"}
        </Text>
      </View>
    </View>
  );
};

export type PropTextProps = {
  small?: boolean;
};
export const PropText: React.FC<PropTextProps> = ({ small, children }) => {
  return (
    <Text
      style={{
        fontSize: small ? "7px" : "12px",
        paddingRight: "8px"
      }}
    >
      {children}
    </Text>
  );
};
