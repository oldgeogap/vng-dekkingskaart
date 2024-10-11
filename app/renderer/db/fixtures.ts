import { Provider, CoverageType, AppState } from "./models";

export const providerFixture: Provider[] = [
  { name: "KPN", color: "#009900" },
  { name: "Vodafone", color: "#E60000" },
  { name: "Odido", color: "#8D85FF" }
];

export const coverageTypeFixture: CoverageType[] = [
  { name: "Spraak 2G/3G" },
  { name: "Spraak IP" },
  { name: "Data regulier" },
  { name: "Data hoog" }
];

export const appStateFixture: AppState[] = [
  { id: 1, municipalitySelection: [], coverageFileSelection: [], pointSelection: [], randomPointSelection: [] }
];
