import fs from "fs";

export function logToFile(s: any, name: string, ext: string = "txt") {
  console.log("Writing log file:", name);
  fs.writeFileSync(`/Users/les/projects/spatialexplorers/vng-dekkingskaart/app/log/${name}.${ext}`, JSON.stringify(s));
}
