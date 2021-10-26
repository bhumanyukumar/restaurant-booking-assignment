import { Document, Model, model, Schema, Types } from 'mongoose';
import ITableReservation from '../interfaces/models/ITableReservation';

export enum RESERVATION_STATUS {
    RESERVED = 'Reserved',
    CANCELLED = 'Cancelled',
}

export interface ITableReservationModel extends ITableReservation, Document {
    _id: Types.ObjectId;
}

const TableSchema: Schema = new Schema({
    _id: { type: Types.ObjectId },
    number: { type: Number },
    capacity: { type: Number },
});

const ReservedBySchema: Schema = new Schema({
    _id: { type: Types.ObjectId },
    name: { type: String },
    phone: { type: String },
});

const ReservationStatusHistorySchema: Schema = new Schema({
    status: { type: String, enum: Object.values(RESERVATION_STATUS) },
    at: { type: Date },
});

const TableReservationSchema: Schema = new Schema({
    table: TableSchema,
    status: { type: String, enum: Object.values(RESERVATION_STATUS) },
    /**
     * //The field below is commented for future use
     * reservedBy: ReservedBySchema,
     */
    from: { type: Date },
    to: { type: Date },
    statusHistory: [ReservationStatusHistorySchema],
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

const TableReservation: Model<ITableReservationModel> = model<ITableReservationModel>(
    'TableReservation', TableReservationSchema, 'tableReservations',
);

export default TableReservation;
