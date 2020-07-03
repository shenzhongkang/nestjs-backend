import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class Log {
  readonly info: winston.LeveledLogMethod;
  readonly warn: winston.LeveledLogMethod;
  readonly debug: winston.LeveledLogMethod;
  readonly error: winston.LeveledLogMethod;

  constructor() {
    const logger = winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({ stderrLevels: [] })
      ]
    });

    this.info = logger.info.bind(logger);
    this.warn = logger.warn.bind(logger);
    this.debug = logger.debug.bind(logger);
    this.error = logger.error.bind(logger);
  }
}