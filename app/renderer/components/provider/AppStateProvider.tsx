import * as React from "react";
import { AppState, db, Municipality } from "../../db";
export interface IAppStateProvider {
  municipalitySelection: Municipality[];
  municipalitySelect: (munis: Municipality[]) => void;
  municipalityDeselect: (ids: string[]) => void;
}

const defaultContext: IAppStateProvider = {
  municipalitySelection: [],
  municipalitySelect: (munis: Municipality[]) => null,
  municipalityDeselect: (ids: string[]) => null
};

const AppStateProviderContext = React.createContext<IAppStateProvider>(defaultContext);

export interface AppStateProviderProps {
  children: React.ReactNode;
}

const APPSTATE_ID = 1;

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [municipalitySelection, setMunicipalitySelection] = React.useState<Municipality[]>([]);
  const seedHasRun = React.useRef(false);
  //seed
  React.useEffect(() => {
    const action = async () => {
      let result = await db.appstate.get(APPSTATE_ID);
      if (result) {
        setMunicipalitySelection(result.municipalitySelection);
      }
      seedHasRun.current = true;
    };
    action();
  }, []);

  React.useEffect(() => {
    if (seedHasRun.current) {
      console.log("Updating app state in the background");
      db.appstate.update(APPSTATE_ID, { municipalitySelection });
    }
  }, [municipalitySelection]);

  const municipalitySelect = (munis: Municipality[]) => {
    setMunicipalitySelection((c) => [...c, ...munis]);
  };

  const municipalityDeselect = (ids: string[]) => {
    setMunicipalitySelection((c) => c.filter((m) => ids.findIndex((id) => id === m.id) === -1));
  };

  return (
    <AppStateProviderContext.Provider
      value={{
        municipalitySelection,
        municipalitySelect,
        municipalityDeselect
      }}
    >
      {children}
    </AppStateProviderContext.Provider>
  );
}

export function useAppState() {
  const context = React.useContext(AppStateProviderContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppStateProvider");
  }
  return context;
}
