import * as React from "react";
import { LocationPoint } from "renderer/types";

export interface LocationCheckProviderProps {
  children: React.ReactNode;
}

export interface ILocationCheckContext {
  preset?: LocationPoint;
  points: LocationPoint[];
  setPreset: React.Dispatch<React.SetStateAction<LocationPoint>>;
  setPoints: React.Dispatch<React.SetStateAction<LocationPoint[]>>;
}

const defaultLocationCheckContact: ILocationCheckContext = {
  preset: undefined,
  points: [],
  setPoints: () => {},
  setPreset: () => {}
};

export const LocationCheckContext = React.createContext<ILocationCheckContext>(defaultLocationCheckContact);

export function LocationCheckProvider({ children }: LocationCheckProviderProps) {
  const [preset, setPreset] = React.useState<LocationPoint | null>(null);
  const [points, setPoints] = React.useState<LocationPoint[]>([]);

  return (
    <LocationCheckContext.Provider value={{ preset, points, setPoints, setPreset }}>
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
