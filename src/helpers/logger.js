import { createLogger, format, transports } from 'winston';
import __dirname from "../utils.js";

const { combine, timestamp, prettyPrint, simple } = format;

const logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
        new transports.Console({ level: 'info' }),
    ]
});

const errorLogger = createLogger({
    format: combine(timestamp(), simple()),
    level: 'error',
    transports: [
        new transports.File({
            filename: `${__dirname}/logs/error.log`,
            level: 'error'
        })
    ]
});

const warnLogger = createLogger({
    format: combine(timestamp(), simple()),
    level: 'warn',
    transports: [
        new transports.File({
            filename: `${__dirname}/logs/warn.log`,
            level: 'warn',
        })
    ]
});

export {
    warnLogger,
    errorLogger,
    logger
}