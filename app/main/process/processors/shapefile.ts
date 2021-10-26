import shp from "shpjs";
import fs from "fs-extra";

export async function processShapefile(path: string, targetFile: string) {
  const content = fs.readFileSync(path);
  let buf = Buffer.from(content);
  const converted = await shp(buf);

  await fs.outputFile(targetFile, JSON.stringify(converted, null, "  "));

  return targetFile;
}

// function toArrayBuffer(buf) {
//   var ab = new ArrayBuffer(buf.length);
//   var view = new Uint8Array(ab);
//   for (var i = 0; i < buf.length; ++i) {
//     view[i] = buf[i];
//   }
//   return ab;
// }
