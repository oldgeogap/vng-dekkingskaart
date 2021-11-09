import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../ui/theme";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppProvider } from "renderer/components/provider/AppProvider";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "renderer/components/error/ErrorFallback";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary onReset={() => console.log("reset")} FallbackComponent={ErrorFallback}>
      <ChakraProvider theme={theme}>
        <AppProvider>
          <Head>
            <link rel="stylesheet" type="text/css" href="/nprogress.css" />
          </Head>
          <Component {...pageProps} />
        </AppProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}
export default MyApp;
