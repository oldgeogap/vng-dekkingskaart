import * as turf from "@turf/turf";

export type MunicipalityArea = {
  id: string;
  name: string;
  area: number;
  area_calculated: number;
};

export type MunicipalityAreasResult = {
  municipalityAreas: MunicipalityArea[];
};

export async function calculateMunicipalityAreas(): Promise<MunicipalityAreasResult> {
  console.log("calculateMunicipalityAreas");
  let result: MunicipalityArea[] = [];

  let muniJSON = await fetch("/data/gemeenten.geojson").then((res) => res.json());

  for (let i = 0, n = muniJSON.features.length; i < n; i++) {
    let muni = muniJSON.features[i];
    let area = turf.area(muni);

    result.push({
      id: muni.properties.id,
      name: muni.properties.name,
      area: muni.properties.area,
      area_calculated: area
    });
  }
  console.log("Done", result.length);
  return {
    municipalityAreas: result
  };
}
