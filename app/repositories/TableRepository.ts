import IPaginationAttrs from '../interfaces/IPaginationAttrs';
import ITable from '../interfaces/models/ITable';
import Table, { ITableModel } from '../models/Table';
import { RESERVATION_STATUS } from '../models/TableReservation';

export default class TableRepository {

    public create = async (table: ITable): Promise<ITableModel> => {
        return Table.create(table);
    }

    public findTablesByAttrsAndFilters = async (
        attrs: Partial<ITable>,
        paginationAttrs?: IPaginationAttrs,
    ) => {
        const where = attrs ? { ...attrs } : {};
        const queryToBeExecuted = Table.find(where);
        if (paginationAttrs) {
            queryToBeExecuted.sort({ _id: 1 }).skip(paginationAttrs.offset).limit(paginationAttrs.limit);
        }
        return queryToBeExecuted.exec();
    }

    public findAvailableTablesByFilters = async (
        filters: { from: Date, to: Date },
        paginationAttrs: IPaginationAttrs,
    ) => {

        const where: any = {};
        where.status = RESERVATION_STATUS.RESERVED;
        where.$or = this.orConditionToGetAllReservationsOverlapingInGivenTime(filters);

        return Table.aggregate([
            { $limit: 1 },
            {
                $lookup: {
                    from: 'tableReservations', pipeline: [
                        { $match: where },
                    ], as: 'reservations',
                },
            },
            {
                $lookup: {
                    from: 'tables', let: { tableIds: '$reservations.table._id' }, pipeline: [
                        { $match: { $expr: { $not: { $in: ['$_id', { $ifNull: ['$$tableIds', []] }] } } } },
                        { $sort: { _id: 1 } },
                        { $skip: paginationAttrs.offset },
                        { $limit: paginationAttrs.limit },
                    ], as: 'tables',
                },
            },
            { $unwind: '$tables' },
            { $replaceRoot: { newRoot: '$tables' } },
        ]).exec();
    }

    private orConditionToGetAllReservationsOverlapingInGivenTime = (filters: { from: Date, to: Date }) => [
        { from: { $lte: new Date(filters.from) }, to: { $gte: new Date(filters.to) } },
        { from: { $lte: new Date(filters.from) }, to: { $gt: new Date(filters.from), $lte: new Date(filters.to) } },
        { from: { $gte: new Date(filters.from), $lt: new Date(filters.to) }, to: { $gte: new Date(filters.to) } },
        { from: { $gte: new Date(filters.from) }, to: { $lte: new Date(filters.to) } },
    ]
}
