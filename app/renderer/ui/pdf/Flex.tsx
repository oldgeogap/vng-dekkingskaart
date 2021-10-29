import * as React from "react";
import { View } from "@react-pdf/renderer";

export interface FlexProps {
  mb?: number;
}

export const Flex: React.FC<FlexProps> = ({ mb = 0, children }) => {
  return (
    <View
      style={{
        marginBottom: `${mb}px`,
        display: "flex",
        flexDirection: "row"
      }}
    >
      {children}
    </View>
  );
};

export const FlexCol: React.FC = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};
