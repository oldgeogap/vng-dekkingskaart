import * as React from "react";
import { LocationPoint } from "renderer/types";

export interface RandomizerProviderProps {
  children: React.ReactNode;
}

export interface IRandomizerContext {
  preset?: LocationPoint;
  setPreset: React.Dispatch<React.SetStateAction<LocationPoint>>;
  hover?: LocationPoint;
  setHover: React.Dispatch<React.SetStateAction<LocationPoint>>;
}

const defaultRandomizerContact: IRandomizerContext = {
  preset: undefined,
  setPreset: () => {},
  hover: undefined,
  setHover: () => {}
};

export const RandomizerContext = React.createContext<IRandomizerContext>(defaultRandomizerContact);

export function RandomizerProvider({ children }: RandomizerProviderProps) {
  const [preset, setPreset] = React.useState<LocationPoint | null>(null);
  const [hover, setHover] = React.useState<LocationPoint | null>(null);

  return (
    <RandomizerContext.Provider value={{ preset, setPreset, hover, setHover }}>{children}</RandomizerContext.Provider>
  );
}

export function useRandomizer() {
  const context = React.useContext(RandomizerContext);
  if (context === undefined) {
    throw new Error("useRandomizer must be used within a Provider");
  }
  return context;
}
