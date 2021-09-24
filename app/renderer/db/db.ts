import Dexie, { Table } from "dexie";
import { Provider, CoverageType, CoverageFile } from "./models";
import { providerFixture, coverageTypeFixture } from "./fixtures";

class VngDB extends Dexie {
  public provider: Table<Provider>;
  public coveragetype: Table<CoverageType>;
  public coveragefile: Table<CoverageFile>;

  private static VERSION = 1;

  constructor() {
    super("vngdb");

    this.version(VngDB.VERSION).stores({
      provider: "++id, &name",
      coveragetype: "++id, &name",
      coveragefile: "++id, provider, year, status, coverage_type"
    });

    this.on("populate", () => {
      this.provider.bulkAdd(providerFixture, { allKeys: true });
      this.coveragetype.bulkAdd(coverageTypeFixture, { allKeys: true });
    });
  }
}

export const db = new VngDB();
