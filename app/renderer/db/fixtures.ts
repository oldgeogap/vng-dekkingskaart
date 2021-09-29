import { Provider, CoverageType, AppState } from "./models";

export const providerFixture: Provider[] = [
  { name: "KPN" },
  { name: "Vodafone" },
  { name: "T-Mobile" },
  { name: "Tele2" },
  { name: "Telford" }
];

export const coverageTypeFixture: CoverageType[] = [
  { name: "Spraak" },
  { name: "Data laag" },
  { name: "Data gemiddeld" },
  { name: "Data hoog" }
];

export const appStateFixture: AppState[] = [{ id: 1, municipalitySelection: [] }];
