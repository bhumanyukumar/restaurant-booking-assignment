import { Types } from 'mongoose';
import { RESERVATION_STATUS } from '../../models/TableReservation';

export interface ITable {
    readonly _id: Types.ObjectId;
    number: number;
    capacity: number;
    status: RESERVATION_STATUS;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default ITable;
