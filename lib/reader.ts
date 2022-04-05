import { Logger } from './logger';

export type ReaderMatcher = (path: string) => Promise<void>;

export class Reader {
  matchers: [RegExp, ReaderMatcher][] = [];
  filePaths: string[] = [];

  constructor(private readonly logger: Logger) { }

  setPaths(paths: string[]) {
    this.filePaths = paths;
    return this;
  }

  addMatcher(reg: RegExp, callback: ReaderMatcher) {
    this.matchers.push([reg, callback]);
    return this;
  }

  async applyMatchers() {
    for (const path of this.filePaths) {
      for (const [reg, callback] of this.matchers) {
        if (reg.test(path)) {
          this.logger.log(`Start scan ${path} by pattern (${reg})`);
          await callback(path);
        }
      }
    }
  }
}
