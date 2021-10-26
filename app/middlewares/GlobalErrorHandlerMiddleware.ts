import { NextFunction, Response } from 'express';
import CommonConstants from '../constants/CommonConstants';
import ErrorCodes from '../constants/ErrorCodes';
import ErrorMessages from '../constants/ErrorMessages';
import ErrorNames from '../constants/ErrorNames';
import BaseController from '../controllers/BaseController';
import RepositoryError from '../errors/RepositoryError';
import Logger from '../services/Logger';

export class GlobalErrorHandlerMiddleware extends BaseController {

    public handleError = (error, req: Request, res: Response, next: NextFunction) => {

        try {
            if (error.name === ErrorNames.REPOSITORY_ERROR) {
                this.handleRepositoryErrors(error, req, res, next);
            } else if (error.name === ErrorNames.SERVICE_ERROR) {
                this.handleServiceErrors(error, req, res, next);
            } else {
                throw error;
            }
        } catch (error) {
            this.handleUnhandledErrors(error, req, res, next);
        }
    }

    private handleServiceErrors = (error: RepositoryError, req: Request, res: Response, next: NextFunction) => {

        const description = this.getDescription(error);

        // tslint:disable-next-line: no-small-switch
        switch (error.code) {

            case ErrorCodes.NOT_FOUND:
                return this.errorResponse(res, this.NOT_FOUND, {
                    message: ErrorMessages.NOT_FOUND,
                    description,
                });

            case ErrorCodes.ACCESS_DENIED:
                return this.errorResponse(res, this.UNAUTHORIZED, {
                    code: error.code,
                    message: error.message,
                });

            case ErrorCodes.TABLE_ALREADY_EXIST:
            case ErrorCodes.TABLE_ALREADY_RESERVED:
                return this.errorResponse(res, this.UNPROCESSABLE_ENTITY, {
                    code: error.code,
                    message: error.message,
                });
            default:
                throw error;
        }
    }

    private handleRepositoryErrors = (error: RepositoryError, req: Request, res: Response, next: NextFunction) => {

        const description = this.getDescription(error);
        Logger.debug(description);
    }

    private handleUnhandledErrors = (error: RepositoryError, req: Request, res: Response, next: NextFunction) => {

        const description = this.getDescription(error);

        Logger.error(error.stack);

        return this.errorResponse(res, this.INTERNAL_SERVER_ERROR, {
            message: 'Unknown Error',
            description,
        });
    }

    private getDescription = (error) => {
        if (process.env.NODE_ENV !== CommonConstants.ENVIRONMENTS.PROD) {
            return error.stack;
        }
        return '';
    }

}

export default new GlobalErrorHandlerMiddleware();
