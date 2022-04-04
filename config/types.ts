export interface ConfigurationParameters {
  directories: {
    root: string;
    whiteList?: PathLists,
    blackList?: {
      symbols?: PathLists,
    }
  },
  review?: {
    symbols?: string[],
  }
}

type PathLists = string[] | null;

