import * as winston from 'winston';

const options = {
    file: {
        level: 'info',
        filename: 'app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
    },
};

const Logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),

    ),
    transports: [
        new winston.transports.File(options.file),
    ],
    exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
    Logger.add(new winston.transports.Console(options.console));
}

export default Logger;
