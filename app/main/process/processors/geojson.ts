import fs from "fs-extra";

export async function processGeoJSON(path: string, targetFile: string) {
  var src = fs.readFileSync(path, "utf8");

  let geojson = JSON.parse(src);
  await postProcessGeoJSON(targetFile, geojson);

  return targetFile;
}

export async function postProcessGeoJSON(targetFile: string, geojson: any) {
  let negative = {
    type: "FeatureCollection",
    features: []
  };

  geojson.features.forEach((feature, n) => {
    if (feature.geometry.type === "Polygon") {
      let id = n + 1;
      //extract all donuts
      if (feature.geometry.coordinates.length > 1) {
        for (let i = 1; i < feature.geometry.coordinates.length; i++) {
          negative.features.push({
            type: "Feature",
            properties: { id },
            geometry: {
              type: "Polygon",
              coordinates: [feature.geometry.coordinates[i]]
            }
          });
        }
      }
      feature.id = id;
      feature.geometry.coordinates = [feature.geometry.coordinates[0]];
    }
  });

  await fs.outputFile(targetFile, JSON.stringify(geojson, null, "  "));
  await fs.outputFile(targetFile.replace(".geojson", ".donuts.geojson"), JSON.stringify(negative, null, "  "));

  return targetFile;
}
