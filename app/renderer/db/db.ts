import Dexie, { Table } from "dexie";
import { Provider, CoverageType, CoverageFile } from "./models";
import { providerFixture, coverageTypeFixture, appStateFixture } from "./fixtures";
import { AppState, Municipality } from ".";

class VngDB extends Dexie {
  public provider: Table<Provider>;
  public coveragetype: Table<CoverageType>;
  public coveragefile: Table<CoverageFile>;
  public appstate: Table<AppState>;
  public municipality: Table<Municipality>;

  private static VERSION = 1;

  constructor() {
    super("vngdb");

    this.version(VngDB.VERSION).stores({
      provider: "++id, &name",
      coveragetype: "++id, &name",
      coveragefile: "++id, provider, year, status, coverage_type",
      appstate: "++id",
      municipality: "++id"
    });

    this.on("populate", () => {
      this.provider.bulkAdd(providerFixture, { allKeys: true });
      this.coveragetype.bulkAdd(coverageTypeFixture, { allKeys: true });
      this.appstate.bulkAdd(appStateFixture);
    });

    this.on("ready", () => {
      this.municipality.clear();
      populateMunicipalities(this);

      // return this.municipality.count((count) => {
      //   if (count === 0) {
      //     return populateMunicipalities(this);
      //   }
      // });
    });
  }
}

export const db = new VngDB();

async function populateMunicipalities(db: VngDB) {
  try {
    let result = await fetch("/data/municipalities.json");
    let json = await result.json();
    db.municipality.bulkAdd(json);
  } catch (err) {
    console.error("Municipality populate error:", err);
  }
}
