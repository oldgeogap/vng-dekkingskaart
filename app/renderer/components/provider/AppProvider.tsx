import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import * as React from "react";
import { Option, useCoverageTypeOptions, useProviderOptions } from "renderer/components/options";
import { AppStateProvider } from "./AppStateProvider";

export interface IAppProviderContext {
  loaded: boolean;
  providerOptions: Option[];
  coverageTypeOptions: Option[];
  providerName: (id: number) => string;
  coverageTypeName: (id: number) => string;
}

const defaultContext: IAppProviderContext = {
  loaded: false,
  providerOptions: [],
  coverageTypeOptions: [],
  providerName: (id: number) => "",
  coverageTypeName: (id: number) => ""
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

  if (!loaded) {
    return (
      <Box p="64px">
        <Spinner />
      </Box>
    );
  }

  const providerName = (id: string | number) => {
    if (typeof id === "string") {
      id = parseInt(id, 10);
    }
    let result = providerOptions.find((option) => option.id == id)?.name || "";
    return result;
  };

  const coverageTypeName = (id: string | number) => {
    return coverageTypeOptions.find((option) => option.id == id)?.name || "";
  };

  return (
    <AppProviderContext.Provider
      value={{
        loaded,
        providerOptions,
        coverageTypeOptions,
        providerName,
        coverageTypeName
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
