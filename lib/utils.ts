import fs from 'fs';

export const safe = <R>(handler: () => R, defaultValue?: R): R | undefined => {
  try {
    return handler() ?? defaultValue;
  } catch (err) {
    console.error(err);
    return defaultValue;
  }
};

export const readFileAsString = (path: string) => fs.promises.readFile(path, { encoding: 'utf8' });

export const readJsonByPath = async (path: string) => {
  const result = await readFileAsString(path);
  return safe(() => JSON.parse(result), {});
}
