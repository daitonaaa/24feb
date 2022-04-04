import chalk from 'chalk';

export class Logger {
  constructor(private readonly context: string) { }

  log(...args: any[]) {
    console.log(chalk.blue(`[${this.context}]`), ...args);
  }
}
