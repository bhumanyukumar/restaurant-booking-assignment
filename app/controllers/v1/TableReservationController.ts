import ITableReservation from 'app/interfaces/models/ITableReservation';
import TableService from 'app/services/TableService';
import { NextFunction, Request, Response } from 'express';
import ErrorCodes from '../../constants/ErrorCodes';
import ServiceError from '../../errors/ServiceError';
import { RESERVATION_STATUS } from '../../models/TableReservation';
import TableReservationService from '../../services/TableReservationService';
import BaseController from '../BaseController';

export default class TableReservationController extends BaseController {

    constructor(private tableReservationService: TableReservationService, private tableService: TableService) {
        super();
    }

    public createReservation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reservation = { ...req.body.reservation };
            reservation = await this.validateAndIncludeReservationDetails(reservation);
            reservation = await this.tableReservationService.create(reservation);
            return this.successResponse(res, { reservation });
        } catch (error) {
            next(error);
        }
    }

    public getReservations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paginationAttrs = this.extractPaginationAttrsFromQuery(req.query);
            const reservations = await this.tableReservationService.getReservationsByAttrs({}, paginationAttrs);
            return this.successResponse(res, { reservations });
        } catch (error) {
            next(error);
        }
    }

    public cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reservationId = req.params.reservationId;
            let [reservation] = await this.tableReservationService.getReservationsByAttrs(
                { _id: reservationId, status: RESERVATION_STATUS.RESERVED },
            );
            if (!reservation) {
                throw new ServiceError(ErrorCodes.NOT_FOUND, 'No reservation found with given details');
            }
            reservation = await this.tableReservationService.cancelReservation({ _id: reservationId });
            return this.successResponse(res, { reservation });
        } catch (error) {
            next(error);
        }
    }

    private validateAndIncludeReservationDetails = async (attrs: Partial<ITableReservation>) => {
        const [table] = await this.tableService.getTables({ _id: attrs.table._id });
        if (!table) {
            throw new ServiceError(ErrorCodes.NOT_FOUND, 'Table not found');
        }
        attrs.table = { _id: table._id, number: table.number, capacity: table.capacity };
        return attrs;
    }

}
