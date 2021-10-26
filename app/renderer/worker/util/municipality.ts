import { Feature, MultiPolygon } from "@turf/helpers";

export async function getMunicipalityShapes(ids: string[]) {
  const totalMunicipalities = ids.length;

  let municipalityShapes: Feature<MultiPolygon>[] = [];
  let muniJSON = await fetch("/data/gemeenten.geojson").then((res) => res.json());

  for (let i = 0, n = muniJSON.features.length; i < n; i++) {
    if (ids.includes(muniJSON.features[i].properties.code)) {
      municipalityShapes.push(muniJSON.features[i]);
    }
    if (municipalityShapes.length === totalMunicipalities) {
      break;
    }
  }

  return municipalityShapes;
}
