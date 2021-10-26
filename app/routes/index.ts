import express from 'express';
import V1 from './v1';
export class Routes {

    public static getRouter() {
        const router = express.Router();

        router.use('/v1', V1.getRouter());

        return router;
    }

}

export default Routes;
