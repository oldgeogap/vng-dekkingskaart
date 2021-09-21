export interface Provider {
  id?: number;
  name: string;
}

export interface DataType {
  id?: number;
  name: string;
}

export interface DataFile {
  id?: number;
  filename: string;
  data_type: string;
  year: number;
}
