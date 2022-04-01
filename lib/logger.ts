export class Logger {
  constructor(private readonly context: string) {}

  log(...args: any[]) {
    console.log(`[${this.context}]`, ...args);
  }
}
