import express from 'express';
import ReservationRoutes from './reservations';
import TableRoutes from './tables';

export class V1 {

    public static getRouter() {
        const router = express.Router();
        router.get('/status', (req, res) => {
            res.send({ version: 0.1 });
        });
        router.use('/reservations', ReservationRoutes.getRouter());
        router.use('/tables', TableRoutes.getRouter());
        return router;
    }

}

export default V1;
