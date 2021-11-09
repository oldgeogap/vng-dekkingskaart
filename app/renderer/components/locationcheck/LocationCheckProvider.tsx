import * as React from "react";
import { LocationPoint } from "renderer/types";
import { useAppState } from "../provider/AppStateProvider";

export interface LocationCheckProviderProps {
  children: React.ReactNode;
}

export interface ILocationCheckContext {
  preset?: LocationPoint;
  setPreset: React.Dispatch<React.SetStateAction<LocationPoint>>;
  hover?: LocationPoint;
  setHover: React.Dispatch<React.SetStateAction<LocationPoint>>;
}

const defaultLocationCheckContact: ILocationCheckContext = {
  preset: undefined,
  setPreset: () => {},
  hover: undefined,
  setHover: () => {}
};

export const LocationCheckContext = React.createContext<ILocationCheckContext>(defaultLocationCheckContact);

export function LocationCheckProvider({ children }: LocationCheckProviderProps) {
  const [preset, setPreset] = React.useState<LocationPoint | null>(null);
  const [hover, setHover] = React.useState<LocationPoint | null>(null);

  return (
    <LocationCheckContext.Provider value={{ preset, setPreset, hover, setHover }}>
      {children}
    </LocationCheckContext.Provider>
  );
}

export function useLocationCheck() {
  const context = React.useContext(LocationCheckContext);
  if (context === undefined) {
    throw new Error("useLocationCheck must be used within a Provider");
  }
  return context;
}
