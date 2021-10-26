import { Types } from 'mongoose';
import { RESERVATION_STATUS } from '../../models/TableReservation';
import ITable from './ITable';

export interface ITableReservation {
    readonly _id: Types.ObjectId;
    table: Pick<ITable, '_id' | 'capacity' | 'number'>;
    from: Date;
    to: Date;
    reservedBy: {
        _id?: Types.ObjectId;
        name: string;
        phone: string;
    };
    status: RESERVATION_STATUS;
    statusHistory: Array<{ status: RESERVATION_STATUS, at: Date }>;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default ITableReservation;
