import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import * as React from "react";
import { Option, useCoverageTypeOptions, useProviderOptions } from "renderer/components/options";
import { AppStateProvider } from "./AppStateProvider";

export interface IAppProviderContext {
  loaded: boolean;
  providerOptions: Option[];
  coverageTypeOptions: Option[];
}

const defaultContext: IAppProviderContext = {
  loaded: false,
  providerOptions: [],
  coverageTypeOptions: []
};

export const AppProviderContext = React.createContext<IAppProviderContext>(defaultContext);

export interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [loaded, setLoaded] = React.useState(false);
  const providerOptions = useProviderOptions();
  const coverageTypeOptions = useCoverageTypeOptions();

  React.useEffect(() => {
    if (providerOptions.length && coverageTypeOptions.length) {
      setLoaded(true);
    }
  }, [providerOptions, coverageTypeOptions]);

  if (!loaded)
    return (
      <Box p="64px">
        <Spinner />
      </Box>
    );

  return (
    <AppProviderContext.Provider
      value={{
        loaded,
        providerOptions,
        coverageTypeOptions
      }}
    >
      <AppStateProvider>{children}</AppStateProvider>
    </AppProviderContext.Provider>
  );
}

export function useApp() {
  const context = React.useContext(AppProviderContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
