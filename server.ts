// tslint:disable: no-console
import * as dotenv from 'dotenv';
dotenv.config();

import App from './app/app';
import Logger from './app/services/Logger';

const app = new App();
app.startHttpServer();

process.on('unhandledRejection', (reason, p) => {
    Logger.error('high severity error: Unhandled Rejection');
    Logger.error({reason});
    Logger.error({promise: p});

    console.log({reason});
    console.log({promise: p});
}).on('uncaughtException', (err) => {
    Logger.error('high severity error: Uncaught Exception thrown', err.stack);
    console.log(err.stack);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
    process.exit();
}
