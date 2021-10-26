import { Types } from 'mongoose';
import IPaginationAttrs from '../interfaces/IPaginationAttrs';
import ITableReservation from '../interfaces/models/ITableReservation';
import TableReservation, { ITableReservationModel } from '../models/TableReservation';
import { RESERVATION_STATUS } from '../models/TableReservation';

export default class TableReservationRepository {

    public create = async (tableReservation: ITableReservation): Promise<ITableReservationModel> => {
        return TableReservation.create(tableReservation);
    }

    public findTableReservationsByAttrs = async (
        attrs: Partial<ITableReservation>,
        paginationAttrs?: IPaginationAttrs,
    ) => {
        const where = attrs ? { ...attrs } : {};
        const queryToBeExecuted = TableReservation.find(where);
        if (paginationAttrs) {
            queryToBeExecuted.sort({ _id: -1 }).skip(paginationAttrs.offset).limit(paginationAttrs.limit);
        }
        return queryToBeExecuted.exec();
    }

    public findAvailableTablesByFilters = async (
        attrs: Partial<ITableReservation> = {},
        filters: { from: Date, to: Date },
        paginationAttrs: IPaginationAttrs,
    ) => {
        attrs = attrs ? { ...attrs } : {};

        const where: any = attrs;
        where.status = RESERVATION_STATUS.RESERVED;
        where.$or = this.orConditionToGetAllReservationsOverlapingInGivenTime(filters);

        return TableReservation.aggregate([
            { $match: where },
            { $group: { _id: null, tableIds: { $push: '$table._id' } } },
            {
                $lookup: {
                    from: 'tables', let: { tableIds: '$tableIds' }, pipeline: [
                        { $match: { $expr: { $not: { $in: ['$_id', '$$tableIds'] } } } },
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

    public cancelReservation = async (
        attrs: Partial<ITableReservation>,
    ) => {
        return TableReservation.findOneAndUpdate(
            attrs,
            {
                $set: { status: RESERVATION_STATUS.CANCELLED },
                $push: { statusHistory: { status: RESERVATION_STATUS.CANCELLED, at: new Date() } },
            },
            { new: true },
        ).exec();
    }

    public checkIfTableAlreadyReservedForGivenSlot = async (
        attrs: { tableId: Types.ObjectId, from: Date, to: Date },
    ) => {
        return TableReservation.findOne({
            'table._id': attrs.tableId,
            'status': RESERVATION_STATUS.RESERVED,
            '$or': this.orConditionToGetAllReservationsOverlapingInGivenTime(attrs),
        }).exec();
    }

    private orConditionToGetAllReservationsOverlapingInGivenTime = (filters: { from: Date, to: Date }) => [
        { from: { $lte: new Date(filters.from) }, to: { $gte: new Date(filters.to) } },
        { from: { $lte: new Date(filters.from) }, to: { $gt: new Date(filters.from), $lte: new Date(filters.to) } },
        { from: { $gte: new Date(filters.from), $lt: new Date(filters.to) }, to: { $gte: new Date(filters.to) } },
        { from: { $gte: new Date(filters.from) }, to: { $lte: new Date(filters.to) } },
    ]
}
