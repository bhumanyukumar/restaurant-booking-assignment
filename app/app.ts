import * as dotenv from 'dotenv';

dotenv.config();
import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoSetup from './config/mongoSetup';
import globalErrorHandlerMiddleware from './middlewares/GlobalErrorHandlerMiddleware';
import { Routes } from './routes';
import Logger from './services/Logger';

import { createServer } from 'http';

export default class App {
    public app: any;
    public routes = Routes;

    constructor() {
        this.app = express();
        mongoSetup();
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use('/api/', this.routes.getRouter());
        this.app.use(globalErrorHandlerMiddleware.handleError);
    }
    public startHttpServer = () => {
        const httpServer = createServer(this.app);
        httpServer.listen(process.env.LISTEN_PORT, () => {
            Logger.info('Express server listening on port ' + process.env.LISTEN_PORT);
        });
    }

}
