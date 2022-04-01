export interface ConfigurationParameters {
  directories: {
    root: string;
    packages?: PathLists,
    symbols?: PathLists
  },
  review?: {
    symbols?: string[],
  }
}

interface PathLists {
  whiteList: string[] | null,
  blackList: string[] | null
}
