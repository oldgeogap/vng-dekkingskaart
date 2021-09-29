import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../ui/theme";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppProvider } from "renderer/components/provider/AppProvider";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}
export default MyApp;
