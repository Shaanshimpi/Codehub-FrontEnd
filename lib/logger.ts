// Simple logger utility to replace console.log statements
export const logger = {
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`🐛 ${message}`, ...args);
    }
  },
};
