import Dexie, { Table } from "dexie";
import { Provider, DataType, DataFile } from "./models";
import { providerFixture } from "./fixtures";

class VngDB extends Dexie {
  public provider: Table<Provider>;
  public datatype: Table<DataType>;
  public datafile: Table<DataFile>;

  private static VERSION = 1;

  constructor() {
    super("vngdb");

    this.version(VngDB.VERSION).stores({
      provider: "++id, &name",
      datatype: "++id, &name",
      datafiles: "++id, filename, data_type"
    });

    this.on("populate", () => {
      this.provider.bulkAdd(providerFixture, { allKeys: true });
    });
  }
}

export const db = new VngDB();
