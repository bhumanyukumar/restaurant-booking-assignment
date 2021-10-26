import { Document, Model, model, Schema, Types } from 'mongoose';
import ITable from '../interfaces/models/ITable';

export interface ITableModel extends ITable, Document {
    _id: Types.ObjectId;
}

const TableSchema: Schema = new Schema({
    number: { type: Number },
    capacity: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});
const Table: Model<ITableModel> = model<ITableModel>(
    'Table', TableSchema, 'tables',
);

export default Table;
