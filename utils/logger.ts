/**
 * Logger utility that conditionally logs based on environment
 * Only logs in development or when DEBUG=true
 */

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private isDebugMode(): boolean {
    // Check multiple ways to determine if we should log
    const env = process.env.NODE_ENV;
    const debug = process.env.DEBUG;
    const environment = process.env.ENVIRONMENT;

    // Log in development
    if (env === "development") return true;

    // Log if DEBUG is explicitly set
    if (debug === "true" || debug === "1") return true;

    // Log if ENVIRONMENT is set to DEV or DEVELOPMENT
    if (environment === "DEV" || environment === "DEVELOPMENT") return true;

    return false;
  }

  private formatMessage(level: LogLevel, ...args: any[]): void {
    if (!this.isDebugMode()) return;

    const prefix = `[${level.toUpperCase()}]`;

    switch (level) {
      case "debug":
        console.log(prefix, ...args);
        break;
      case "info":
        console.log(prefix, ...args);
        break;
      case "warn":
        console.warn(prefix, ...args);
        break;
      case "error":
        console.error(prefix, ...args);
        break;
    }
  }

  debug(...args: any[]): void {
    this.formatMessage("debug", ...args);
  }

  info(...args: any[]): void {
    this.formatMessage("info", ...args);
  }

  warn(...args: any[]): void {
    this.formatMessage("warn", ...args);
  }

  error(...args: any[]): void {
    // Always log errors, regardless of environment
    console.error(...args);
  }

  log(...args: any[]): void {
    if (!this.isDebugMode()) return;
    console.log(...args);
  }
}

export const logger = new Logger();
