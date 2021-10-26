import * as React from "react";
import { LocationPoint } from "renderer/types";

export interface RandomizerProviderProps {
  children: React.ReactNode;
}

export interface IRandomizerContext {
  preset?: LocationPoint;
  points: LocationPoint[];
  setPreset: React.Dispatch<React.SetStateAction<LocationPoint>>;
  setPoints: React.Dispatch<React.SetStateAction<LocationPoint[]>>;
}

const defaultRandomizerContact: IRandomizerContext = {
  preset: undefined,
  points: [],
  setPoints: () => {},
  setPreset: () => {}
};

export const RandomizerContext = React.createContext<IRandomizerContext>(defaultRandomizerContact);

export function RandomizerProvider({ children }: RandomizerProviderProps) {
  const [preset, setPreset] = React.useState<LocationPoint | null>(null);
  const [points, setPoints] = React.useState<LocationPoint[]>([]);

  return (
    <RandomizerContext.Provider value={{ preset, points, setPoints, setPreset }}>{children}</RandomizerContext.Provider>
  );
}

export function useRandomizer() {
  const context = React.useContext(RandomizerContext);
  if (context === undefined) {
    throw new Error("useRandomizer must be used within a Provider");
  }
  return context;
}
