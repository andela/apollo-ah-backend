import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import rootPath from 'app-root-path';

let isProduction;

/**
 * Encapsulates the winston logging library.
 * Display logs in the console in development environment and in a file in production environment
 * @export
 * @class Logger
 */
export default class Logger {
  /**
     * Configure the winston logger
     *
     * @static
     * @param {string} [filename='console.log'] User defined file for storing logs
     * @returns {object} winston logger instance
     * @memberof Logger
     */
  static logger(filename = 'console.log') {
    const rotateFileTransport = new transports.DailyRotateFile({
      filename: path.join(`${rootPath}`, 'log', `/%DATE%-${filename}`),
      datePattern: 'DD-MM-YYYY',
    });
    let level;
    switch (process.env.NODE_ENV) {
      case 'production':
        level = 'debug';
        isProduction = true;
        break;
      case 'test':
        level = 'silly'; // disable logging during tests
        break;
      default:
        level = 'debug';
    }

    return winston.createLogger(
      {
        level,
        handleExceptions: true,
        format: format.combine(
          isProduction ? format.uncolorize() : format.colorize(),
          format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ssa'
          }),
          format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        transports: [
          isProduction ? rotateFileTransport
            : new transports.Console(),
        ]
      }
    );
  }

  /**
 *
 * Used by morgan to pipe stream through winston
 * @static
 * @returns {object} An object wraping a function to pipe streams through winston
 * @memberof Logger
 */
  static stream() {
    return {
      write: (message) => {
        Logger.log(message);
      }
    };
  }

  /**
 * Prints a text on the console with an info label in development and to a file when in production
 * @static
 * @param {string} message the text to display
 * @param {string} filename File to print to during production. Defaults to console.log
 * @memberof Logger
 * @returns {void}
 */
  static log(message, filename) {
    Logger.logger(filename).info(message);
  }

  /**
 * Prints a text on the console with an error label in development and to a file when in production
 * @static
 * @param {string} message the text to display
 * @param {string} filename File to print to during production. Defaults to console.log
 * @memberof Logger
 * @returns {void}
 */
  static error(message, filename) {
    Logger.logger(filename).error(message);
  }

  /**
 * Make the Logger class global and easy to accesss. Simply call logger.log() or logger.error().
 * Without calling this code, you need to import this module when needed.
 *
 * @static
 * @memberof Logger
 * @returns {void}
 */
  static config() {
    global.logger = Logger;
  }
}
