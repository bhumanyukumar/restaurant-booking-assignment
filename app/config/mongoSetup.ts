import mongoose from 'mongoose';
import Logger from '../services/Logger';

export default async function mongoSetup(): Promise<void> {
    return new Promise((resolve, reject) => {
        (mongoose as any).Promise = global.Promise;
        mongoose.set('debug', process.env.LOG_MONGO_QUERIES === 'true');
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.connect(process.env.DB_MONGO_HOST, { useNewUrlParser: true }).then(() => {
            Logger.info('Connected to mongodb');
            resolve();
        });
        const Str = mongoose.Schema.Types.String as any;
        Str.checkRequired((v) => v != null);
    });
}
