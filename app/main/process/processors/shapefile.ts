import shp from "shpjs";
import fs from "fs-extra";
import { postProcessGeoJSON } from "./geojson";

export async function processShapefile(path: string, targetFile: string) {
  const content = fs.readFileSync(path);
  let buf = Buffer.from(content);
  const converted = await shp(buf);
  let stats = await postProcessGeoJSON(targetFile, converted);

  return { targetFile, stats };
}

// function toArrayBuffer(buf) {
//   var ab = new ArrayBuffer(buf.length);
//   var view = new Uint8Array(ab);
//   for (var i = 0; i < buf.length; ++i) {
//     view[i] = buf[i];
//   }
//   return ab;
// }
