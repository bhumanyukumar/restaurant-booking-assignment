import { Types } from 'mongoose';
import ErrorCodes from '../constants/ErrorCodes';
import ServiceError from '../errors/ServiceError';
import IPaginationAttrs from '../interfaces/IPaginationAttrs';
import ITableReservation from '../interfaces/models/ITableReservation';
import { RESERVATION_STATUS } from '../models/TableReservation';
import TableReservationRepository from '../repositories/TableReservationRepository';
import BaseService from './BaseService';

export default class TableReservationService extends BaseService {

    constructor(private tableReservationRepository: TableReservationRepository) {
        super();
    }

    public create = async (attrs: Required<Omit<ITableReservation, 'status'>>) => {
        const isTableAlreadyReserved = await this.tableReservationRepository.checkIfTableAlreadyReservedForGivenSlot(
            { tableId: attrs.table._id, from: attrs.to, to: attrs.to },
        );
        if (isTableAlreadyReserved) {
            throw new ServiceError(ErrorCodes.TABLE_ALREADY_RESERVED, 'Reservation Failed');
        }
        const data: ITableReservation = { ...attrs, status: RESERVATION_STATUS.RESERVED };
        return this.tableReservationRepository.create(data);
    }

    public getReservationsByAttrs = async (
        attrs: Partial<ITableReservation>,
        paginationAttrs?: IPaginationAttrs,
    ) => {
        return this.tableReservationRepository.findTableReservationsByAttrs(attrs, paginationAttrs);
    }

    public getAvailableTablesBetweenGivenTime = async (
        attrs: { from: Date, to: Date },
        paginationAttrs: IPaginationAttrs,
    ) => {
        return this.tableReservationRepository.findAvailableTablesByFilters({}, attrs, paginationAttrs);
    }

    public cancelReservation = async (
        attrs: Partial<ITableReservation>,
    ) => {
        return this.tableReservationRepository.cancelReservation(attrs);
    }

}
