import glob from 'glob';
import fs from 'fs';
import { getToxicRepos } from './toxic-repos';
import { Reader } from './reader';
import { readFileAsString, readJsonByPath, safe } from './utils';
import { Report } from './report';
import { Logger } from './logger';
import { Configuration } from '../config';

/**
 * todo
 * 4) Читать наш package.json
 * 5) Осуществить доставку этого в npm
 * 6) Выставить CLI интерфейс
 */

/*
* Инициализация конфигурации
*/
const packageConf = new Configuration();
const pattern = packageConf.rootReviewDir;
const symbolsReview = packageConf.symbolsReview;

(async () => {
  const toxicRepos = await getToxicRepos();
  const toxicReposNames = [...toxicRepos.keys()];

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

  if (symbolsReview.length > 0) {
    reader.addMatcher(/./gm, async path => {
      // TODO: добавить проверку path на отсутствие в blackList
      const file = await readFileAsString(path);
      const blackList = symbolsReview;
      if (blackList.some(flag => file.includes(flag))) {
        report.addItem({
          path: path,
          reason: `Found black list item`,
          comment: ``,
        });
      }
    });
  }

  glob(pattern, { debug: true }, async function (_, candidates) {
    const onlyFiles = candidates.filter(candidate => fs.lstatSync(candidate).isFile());
    reader.setPaths(onlyFiles);
    await reader.applyMatchers();
    if (report.hasItems()) {
      report.print();
      process.exit(1);
    }
  });
})();
