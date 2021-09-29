export interface Provider {
  id?: number;
  name: string;
}

export interface CoverageType {
  id?: number;
  name: string;
}

export type CoverageFileStatus = "working" | "done" | "error";

export interface CoverageFile {
  id?: number;
  provider: number;
  coverage_type: number;
  year: string;
  created_at: number;
  status: CoverageFileStatus;
  importPaths?: string;
  path?: string;
  error?: string | null;
}

export interface Municipality {
  id: string;
  name: string;
}

export interface AppState {
  id?: number;
  municipalitySelection: Municipality[];
}
