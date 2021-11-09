import * as React from "react";
import { LocationPoint } from "renderer/types";
import { AppState, db, Municipality, CoverageFile } from "../../db";
export interface IAppStateProvider {
  municipalitySelection: Municipality[];
  municipalitySelect: (munis: Municipality[]) => void;
  municipalityDeselect: (ids: string[]) => void;

  coverageSelection: CoverageFile[];
  coverageSelect: (cov: CoverageFile[]) => void;
  coverageDeselect: (ids: number[]) => void;

  pointSelection: LocationPoint[];
  pointSelect: (points: LocationPoint[]) => void;
  pointDeselect: (points: LocationPoint[]) => void;

  randomPointSelection: LocationPoint[];
  randomPointSelect: (points: LocationPoint[]) => void;
  randomPointDeselect: (points: LocationPoint[]) => void;
}

const defaultContext: IAppStateProvider = {
  municipalitySelection: [],
  municipalitySelect: (munis: Municipality[]) => null,
  municipalityDeselect: (ids: string[]) => null,

  coverageSelection: [],
  coverageSelect: (cov: CoverageFile[]) => null,
  coverageDeselect: (ids: number[]) => null,

  pointSelection: [],
  pointSelect: (points: LocationPoint[]) => null,
  pointDeselect: (points: LocationPoint[]) => null,

  randomPointSelection: [],
  randomPointSelect: (points: LocationPoint[]) => null,
  randomPointDeselect: (points: LocationPoint[]) => null
};

const AppStateProviderContext = React.createContext<IAppStateProvider>(defaultContext);

export interface AppStateProviderProps {
  children: React.ReactNode;
}

const APPSTATE_ID = 1;

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [municipalitySelection, setMunicipalitySelection] = React.useState<Municipality[]>([]);
  const [coverageSelection, setCoverageSelection] = React.useState<CoverageFile[]>([]);
  const [pointSelection, setPointSelection] = React.useState<LocationPoint[]>([]);
  const [randomPointSelection, setRandomPointSelection] = React.useState<LocationPoint[]>([]);
  const seedHasRun = React.useRef(false);
  //seed
  React.useEffect(() => {
    const action = async () => {
      let result = await db.appstate.get(APPSTATE_ID);
      if (result) {
        setMunicipalitySelection(result.municipalitySelection);
        setCoverageSelection(result.coverageFileSelection);
        setPointSelection(result.pointSelection || []);
        setRandomPointSelection(result.randomPointSelection || []);
      }
      seedHasRun.current = true;
    };
    action();
  }, []);

  React.useEffect(() => {
    if (seedHasRun.current) {
      db.appstate.update(APPSTATE_ID, { municipalitySelection });
    }
  }, [municipalitySelection]);

  React.useEffect(() => {
    if (seedHasRun.current) {
      db.appstate.update(APPSTATE_ID, { coverageFileSelection: coverageSelection });
    }
  }, [coverageSelection]);

  React.useEffect(() => {
    if (seedHasRun.current) {
      db.appstate.update(APPSTATE_ID, { pointSelection });
    }
  }, [pointSelection]);

  React.useEffect(() => {
    if (seedHasRun.current) {
      db.appstate.update(APPSTATE_ID, { randomPointSelection });
    }
  }, [randomPointSelection]);

  const municipalitySelect = (munis: Municipality[]) => {
    let ids = munis.map((m) => m.id);
    setMunicipalitySelection((c) => [...c.filter((m) => !ids.includes(m.id)), ...munis]);
  };

  const municipalityDeselect = (ids: string[]) => {
    setMunicipalitySelection((c) => c.filter((m) => ids.findIndex((id) => id === m.id) === -1));
  };

  const coverageSelect = (cov: CoverageFile[]) => {
    let ids = cov.map((c) => c.id);
    setCoverageSelection((c) => [...c.filter((cm) => !ids.includes(cm.id)), ...cov]);
  };

  const coverageDeselect = (ids: number[]) => {
    setCoverageSelection((c) => c.filter((m) => ids.findIndex((id) => id === m.id) === -1));
  };

  const pointSelect = (points: LocationPoint[]) => {
    setPointSelection((c) => [...c, ...points]);
  };

  const pointDeselect = (points: LocationPoint[]) => {
    setPointSelection((c) => c.filter((p) => points.findIndex((p2) => p2.x === p.x && p2.y == p.y) === -1));
  };

  const randomPointSelect = (points: LocationPoint[]) => {
    setRandomPointSelection((c) => [...c, ...points]);
  };

  const randomPointDeselect = (points: LocationPoint[]) => {
    setRandomPointSelection((c) => c.filter((p) => points.findIndex((p2) => p2.x === p.x && p2.y == p.y) === -1));
  };

  return (
    <AppStateProviderContext.Provider
      value={{
        municipalitySelection,
        municipalitySelect,
        municipalityDeselect,
        coverageSelection,
        coverageSelect,
        coverageDeselect,
        pointSelection,
        pointSelect,
        pointDeselect,
        randomPointSelection,
        randomPointSelect,
        randomPointDeselect
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
