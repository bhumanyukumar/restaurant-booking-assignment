import {UserSessionsRepository} from '../repositories/UserSessionsRepository';
import Logger from '../services/Logger';

export default class AuthMiddleware {

    private userSessionsRepository: UserSessionsRepository;

    public constructor(userSessionsRepository: UserSessionsRepository) {
        this.userSessionsRepository = userSessionsRepository;
    }

    public required = async (req, res, next) => {
        if (req.headers.token || req.query.token) {
            const token = (req.headers.token) ? req.headers.token : req.query.token;
            const userSession: any = await this.userSessionsRepository.findOneByToken(token);
            if (userSession) {
                req.user = {
                    id: userSession.userId,
                    ...userSession.user.toJSON(),
                };
                next();
            } else {
                Logger.error(`HIGH PRIORITY: Invalid auth token` +
                    ` ${req.params && JSON.stringify(req.params)} ${req.headers && JSON.stringify(req.headers)}`);
                res.status(401).send({
                    success: false,
                    message: 'Invalid Auth Token',
                });
            }
        } else {
            Logger.error(`HIGH PRIORITY: auth token not found` +
                ` ${req.params && JSON.stringify(req.params)} ${req.headers && JSON.stringify(req.headers)}`);
            res.status(401).send({
                success: false,
                message: 'Auth token not found',
            });
        }
    }

    public verifyAccessToResource = async (req, res, next) => {
        if (
            (req.user && req.user.id && req.params.userId) &&
            (req.user.id !== Number(req.params.userId))
        ) {
            return res.status(403).send({
                success: false,
                message: 'Access to the requested is resource not allowed.',
            });
        }
        next();
    }

    public optional = async (req, res, next) => {
        req.user = null;
        if (req.headers.token || req.query.token) {
            const token = (req.headers.token) ? req.headers.token : req.query.token;

            const userSession: any = await this.userSessionsRepository.findOneByToken(token);
            if (userSession) {
                req.user = {
                    id: userSession.userId,
                    ...userSession.user.toJSON(),
                };
            } else {
                req.user = null;
            }
        }

        Logger.debug(`optional middlewre`);
        Logger.debug({user: req.user});

        next();
    }

}
