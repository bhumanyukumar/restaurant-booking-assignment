import ErrorCodes from '../constants/ErrorCodes';
import ServiceError from '../errors/ServiceError';
import IPaginationAttrs from '../interfaces/IPaginationAttrs';
import ITable from '../interfaces/models/ITable';
import TableRepository from '../repositories/TableRepository';
import BaseService from './BaseService';
import TableReservationService from './TableReservationService';

export default class TableService extends BaseService {

    constructor(private tableRepository: TableRepository) {
        super();
    }

    public create = async (attrs: ITable) => {
        const [isTableAlreadyExist] = await this.tableRepository.findTablesByAttrsAndFilters({ number: attrs.number });

        if (isTableAlreadyExist) {
            throw new ServiceError(ErrorCodes.TABLE_ALREADY_EXIST, `Table already exist`);
        }

        return this.tableRepository.create(attrs);
    }

    public getTables = async (
        attrs: Partial<ITable>,
        paginationAttrs?: IPaginationAttrs,
    ) => {
        return this.tableRepository.findTablesByAttrsAndFilters(attrs, paginationAttrs);
    }

    public getAvailableTables = async (
        attrs: { from: Date; to: Date; },
        paginationAttrs?: IPaginationAttrs,
    ) => {
        return this.tableRepository.findAvailableTablesByFilters(attrs, paginationAttrs);
    }

}
