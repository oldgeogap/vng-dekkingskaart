import * as React from "react";

import { View, Text, Image } from "@react-pdf/renderer";
import { formatDate } from "renderer/util";

export function PageHeader() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "32px",
        alignItems: "center"
      }}
    >
      <View style={{ flex: 1 }}>
        <Image src="/vnglogo.png" style={{ width: "32px", height: "19px" }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "right",
            fontSize: "8px",
            color: "#bbbec2"
          }}
        >
          {formatDate(new Date())}
        </Text>
      </View>
    </View>
  );
}
