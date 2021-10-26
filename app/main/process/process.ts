import { ipcMain, dialog } from "electron";
import { ipcEvents } from "../../shared";
import { processKML, processGeoJSON } from "./processors";

import { app } from "electron";

import fs from "fs-extra";
import path from "path";
import { processShapefile } from "./processors/shapefile";

ipcMain.on(ipcEvents.BROWSE_FILES, async (event, arg) => {
  let result = await dialog.showOpenDialog({ properties: ["openFile"] });
  event.sender.send(ipcEvents.BROWSE_FILES_RESULT, result.filePaths);
});

ipcMain.on(ipcEvents.DELETE_FILE, async (event, arg) => {
  let targetFile: string = arg.path;
  console.log("Deleting ", targetFile, "...");
  if (targetFile.startsWith(getCoveragePath())) {
    await fs.remove(targetFile);
    event.sender.send(ipcEvents.DELETE_FILE_RESULT, { success: true, result: targetFile });
  } else {
    event.sender.send(ipcEvents.DELETE_FILE_RESULT, { success: false, error: `Niet toegestaan voor "${targetFile}"` });
  }
  //
});

ipcMain.on(ipcEvents.PROCESS_FILES, async (event, arg) => {
  console.log(arg);
  let result = "";
  const { paths, targetName } = arg;
  try {
    result = await processFiles(paths, targetName);
    event.sender.send(ipcEvents.PROCESS_FILES_RESULT, { success: true, path: result });
  } catch (err) {
    event.sender.send(ipcEvents.PROCESS_FILES_RESULT, { success: false, path: null, error: err.message });
  }
});

async function processFiles(paths: string[], targetName: string) {
  if (paths.length === 0) {
    throw new Error("No files selected");
  }
  if (paths.length === 1) {
    //KML or GeoJSON
    let path = paths[0];
    let ext = path.split(".").pop().toLowerCase();
    switch (ext) {
      case "kml":
        return await processKML(path, getTargetPath(targetName));
      case "json":
      case "geojson":
        return await processGeoJSON(path, getTargetPath(targetName));
      case "zip":
        return await processShapefile(path, getTargetPath(targetName));
      default:
        throw new Error("Unsupported file type");
    }
  } else {
    throw new Error("shapefile not supported yet");
  }
}

function getCoveragePath() {
  const appDir = app.getPath("userData");
  const coveragePath = path.join(appDir, "dekkingskaarten");
  fs.ensureDirSync(coveragePath);
  return coveragePath;
}

function getTargetPath(name: string) {
  const coveragePath = getCoveragePath();
  return path.join(coveragePath, `${name}.geojson`);
}
