import express from 'express';
import DI from '../../../DIContainer';
import VM from '../../../middlewares/SchemaValidationMiddleware';
import Schemas from '../../../ValidationSchema/index';
export class TableRoutes {

    public static getRouter() {

        const router = express.Router();

        router.get('/', DI.v1.tableController.getAllTables);

        router.post('/available',
            VM.validate(Schemas.Post_GetAvailableTables),
            DI.v1.tableController.getAvailableTables);

        router.post('/',
            VM.validate(Schemas.PostTable),
            DI.v1.tableController.create);

        return router;
    }

}

export default TableRoutes;
