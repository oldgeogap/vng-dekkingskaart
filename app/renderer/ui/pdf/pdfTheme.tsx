import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({
  family: "RobotoBlack",
  src: "/roboto/Roboto-Black.ttf"
});
Font.register({
  family: "RobotoLight",
  src: "/roboto/Roboto-Light.ttf"
});
Font.register({
  family: "Roboto",
  src: "/roboto/Roboto-Regular.ttf"
});
Font.register({
  family: "RobotoBold",
  src: "/roboto/Roboto-Bold.ttf"
});

export const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  docpreheader: {
    fontSize: 24,
    fontFamily: "RobotoLight"
  },
  docheader: {
    fontSize: 44,
    fontFamily: "RobotoBlack"
  },
  th: {
    fontSize: 12,
    fontFamily: "RobotoBold"
  }
});
