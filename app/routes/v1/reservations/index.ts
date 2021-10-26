import express from 'express';
import DI from '../../../DIContainer';
import VM from '../../../middlewares/SchemaValidationMiddleware';
import Schemas from '../../../ValidationSchema/index';
export class ReservationRoutes {

    public static getRouter() {
        const router = express.Router();

        router.get('/', DI.v1.tableReservationsController.getReservations);

        router.post('/',
            VM.validate(Schemas.PostReservation),
            DI.v1.tableReservationsController.createReservation);

        router.patch('/cancel/:reservationId',
            VM.validate(Schemas.PatchReservation),
            DI.v1.tableReservationsController.cancelReservation);

        return router;
    }

}

export default ReservationRoutes;
