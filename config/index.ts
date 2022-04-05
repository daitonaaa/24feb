import fs from 'fs';
import path from 'path';
import { ConfigType } from './types';

export class Configuration {
  private readonly defaultConfig: ConfigType;
  private readonly applicationConfig: ConfigType | undefined;

  constructor() {
    const appConfPath = path.resolve(process.cwd(), 'config24feb.json');
    const defaultConfPath = path.resolve(__dirname, 'config.default.json');
    const defaultConfRawData = fs.readFileSync(defaultConfPath, {
      encoding: 'utf8'
    });
    let appConfRawData;

    try {
      if (fs.existsSync(appConfPath)) {
        appConfRawData = fs.readFileSync(appConfPath, {
          encoding: 'utf8'
        });
      }
    } catch (e) {
      console.error("Не удалось найти файл конфигурации", e);
    }

    try {
      this.applicationConfig = appConfRawData && JSON.parse(appConfRawData);
      this.defaultConfig = JSON.parse(defaultConfRawData);
    } catch (e) {
      console.error("Не удалось прочитать JSON", e);
    }
  }

  get config() {
    if (this.applicationConfig) {
      this.checkConfig(this.applicationConfig);
      return this.applicationConfig;
    }

    this.checkConfig(this.defaultConfig);
    return this.defaultConfig;
  }

  private checkConfig(config: ConfigType) {
    if (!config) {
      throw Error('Отсутствует файл конфигурации');
    }


    if (!config.rootDir) {
      throw Error('Отсутствует путь для проверки npm пакетов, => directories.root');
    }

    if (!Array.isArray(config.charsForCheck)) {
      throw Error(`Символы к проверке должны указываться как массив, тип ${typeof config.charsForCheck}`);
    }

    if (Array.isArray(config.charsForCheck) && config.charsForCheck.some(s => typeof s !== "string")) {
      throw Error(`Символы к проверке должны указываться как строки`);
    }

    if (!Array.isArray(config.extraPaths)) {
      throw Error(`Дополнительные пути для проверки должны указываться как массив, тип ${typeof config.extraPaths}`);
    }

    if (Array.isArray(config.extraPaths) && config.extraPaths.some(s => typeof s !== "string")) {
      throw Error(`Дополнительные пути должны содержать только строки`);
    }

    if (!Array.isArray(config.ignorePatterns)) {
      throw Error(`Черный список путей должен указываться как массив, тип ${typeof config.ignorePatterns}`);
    }

    if (Array.isArray(config.ignorePatterns) && config.ignorePatterns.some(s => typeof s !== "string")) {
      throw Error(`Черный список путей должен содержать только строки`);
    }
  }

  /**
   * Директория, которую необходимо проверить, как правило node_modules
   */
  get rootDir() {
    return this.config.rootDir;
  }

  /**
   * Список символов, наличие которых необходимо проверить
   */
  get charsForCheck() {
    return this.config.charsForCheck || [];
  }

  /**
   * Пути для символов, которые нужно исключить из проверки
   */
  get ignorePatterns() {
    return this.config.ignorePatterns || [];
  }

  /**
   * Пути для файлов и папок, которые нужно добавить в проверку
   */
  get extraPaths() {
    return this.config.extraPaths || [];
  }
}
