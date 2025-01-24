/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

class Logger {
  log = (...args: Array<any>) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  };

  warn = (...args: Array<any>) => {
    if (__DEV__) {
      console.warn(...args);
    }
  };

  error = (...args: Array<any>) => {
    if (__DEV__) {
      console.error(...args);
    }
  };
}

export const logger = new Logger();
