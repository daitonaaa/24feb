import glob from 'glob';
import fs from 'fs';
import { getToxicRepos } from './toxic-repos';
import { Reader } from './reader';
import { readFileAsString, readJsonByPath, safe } from './utils';
import { Report } from './report';
import { Logger } from './logger';
import { Configuration } from '../config';
import { CommandTypes } from './types';

export class App {
  constructor(private readonly config: Configuration) { }

  async command(cmd: { [x: string]: any }) {
    const cArr = cmd._;
    if (!Array.isArray(cArr) || cArr.length === 0) {
      throw new Error(`Invalid Arguments, ${JSON.stringify(cArr, null, 2)}`)
    }

    const [cName, ...extra] = cArr;
    switch (cName) {
      case CommandTypes.RUN:
        await this.run();
        break;
      default:
        console.error(cName, 'Command not found');
    }
  }

  private async run() {
    const toxicRepos = await getToxicRepos();
    const toxicReposNames = [...toxicRepos.keys()];
    const pattern = this.config.rootDir;
    const charsForCheck = this.config.charsForCheck;
    const ignorePatterns = this.config.ignorePatterns;
    const extraPaths = this.config.extraPaths;

    const report = new Report();
    const reader = new Reader(new Logger('Reader'));

    reader
      .addMatcher(/package\.json$/gm, async path => {
        const json = await readJsonByPath(path);
        if (json) {
          toxicReposNames.forEach(name => {
            // check repo name by name
            if (name !== '-' && json.name === name) {
              report.addItem({
                reason: `Toxic repository name`,
                path: path,
                comment: `[${name}] ${toxicRepos.get(name)?.problem_type}`,
              });
            }

            // check all deps by name
            if (
              name !== '-' &&
              safe(() => Object.keys({ ...json?.devDependencies, ...json?.dependencies }), [])?.includes(name)
            ) {
              report.addItem({
                path: path,
                reason: `Toxic repository dependency`,
                comment: `[${name}] ${toxicRepos.get(name)?.problem_type}`,
              });
            }
          });
        }
      })

    if (charsForCheck.length > 0) {
      reader.addMatcher(/./gm, async path => {
        for (const blackListPath of ignorePatterns) {
          const regex = new RegExp(blackListPath);
          if (regex.test(path)) {
            return;
          }
        }

        const file = await readFileAsString(path);
        const match = charsForCheck.reduce((acc, flag) => {
          if (!acc && file.includes(flag)) {
            acc += `${flag}, `;
          }
          return acc;
        }, '')
        if (match) {
          report.addItem({
            path: path,
            reason: `Found black list item`,
            comment: match,
          });
        }
      });
    }

    glob(pattern, { debug: true }, async function (_, candidates) {
      const onlyFiles = candidates.filter(candidate => fs.lstatSync(candidate).isFile());
      if (extraPaths) {
        onlyFiles.push(...extraPaths);
      }
      reader.setPaths(onlyFiles);
      await reader.applyMatchers();
      if (report.hasItems()) {
        report.print();
        process.exit(1);
      }
    });
  }
}
