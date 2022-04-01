import fs from 'fs';
import path from 'path';
import { ConfigurationParameters } from './types';

export class Configuration {
  private readonly defaultConfig: ConfigurationParameters;
  private readonly applicationConfig: ConfigurationParameters | undefined;

  constructor() {
    var appConfPath = path.resolve(process.cwd(), 'config24feb.json');
    var defaultConfPath = path.resolve(__dirname, '../../', 'defaultConf.json');
    var defaultConfRawData = fs.readFileSync(defaultConfPath, {
      encoding: 'utf8'
    });
    var appConfRawData;

    try {
      if (fs.existsSync(appConfPath)) {
        appConfRawData = fs.readFileSync(appConfPath, {
          encoding: 'utf8'
        });
      }
    } catch (e) {
      console.error("Не смогли файл конфигурации", e);
    }

    try {
      this.applicationConfig = appConfRawData && JSON.parse(appConfRawData);
      this.defaultConfig = JSON.parse(defaultConfRawData);
    } catch (e) {
      console.error("Не смогли прочитать JSON", e);
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

  private checkConfig(config: ConfigurationParameters) {
    if (!config) {
      throw Error('Отсутствует файл конфигурации');
    }

    if (!config.directories) {
      throw Error('Отсутствуют конфигурации директорий, => directories');
    }

    if (!config.directories.root) {
      throw Error('Отсутствует путь для проверки npm пакетов, => directories.root');
    }

    if (config?.review?.symbols && !Array.isArray(config.review.symbols)) {
      throw Error(`Символы к проверке должны указываться как массив, тип ${typeof config.review.symbols}`);
    }

    if (
      config?.review?.symbols &&
      Array.isArray(config.review.symbols) &&
      config.review.symbols.some(s => typeof s !== "string")
    ) {
      throw Error(`Символы к проверке должны указываться как строки`);
    }
  }

  /**
   * Директория, которую необходимо проверить, как правило node_modules
   */
  get rootReviewDir() {
    return this.config.directories.root;
  }

  /**
   * Список символов, наличие которых необходимо проверить
   */
  get symbolsReview() {
    return this.config?.review?.symbols || [];
  }
}
