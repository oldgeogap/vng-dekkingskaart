import { extendTheme } from "@chakra-ui/react";
import styledIn from "@emotion/styled";

const colors = {
  brand: {
    50: "#d8f9ff",
    100: "#abe9ff",
    200: "#7bdaff",
    300: "#48caff",
    400: "#1abaff",
    500: "#00a1e6",
    600: "#0277BD",
    700: "#005982",
    800: "#004489",
    900: "#001421"
  },
  bg: {
    50: "#f0f2f4",
    100: "#d6d8da",
    200: "#bbbec2",
    300: "#9ea5ac",
    400: "#80A2C4",
    500: "#68727d",
    600: "#515860",
    700: "#3b3f44",
    800: "#232629",
    900: "#0b0d0f"
  },
  green: {
    50: "#dafff6",
    100: "#afffe8",
    200: "#80ffde",
    300: "#52ffd7",
    400: "#2ffed5",
    500: "#80CBC4",
    600: "#10b39d",
    700: "#008074",
    800: "#004d40",
    900: "#001c14"
  }
};
export const theme = extendTheme({ colors });
export type VNGTheme = typeof theme;
declare module "@emotion/react" {
  export interface Theme extends VNGTheme {}
}

export const styled = styledIn;
