import { Response } from 'express';
import CommonConstants from '../constants/CommonConstants';
import IPaginationAttrs from '../interfaces/IPaginationAttrs';

export default class BaseController {

    protected readonly SUCCESS = 200;
    protected readonly NO_CONTENT = 204;
    protected readonly BAD_REQUEST = 400;
    protected readonly UNAUTHORIZED = 401;
    protected readonly INTERNAL_SERVER_ERROR = 500;
    protected readonly NOT_FOUND = 404;
    protected readonly FORBIDDEN = 403;
    protected readonly EXPECTATION_FAILED = 417;
    protected readonly UNPROCESSABLE_ENTITY = 422;

    protected successResponse = (res: Response, data: any) => {
        res.status(this.SUCCESS).send(data);
    }

    protected errorResponse = (res: Response, responseCode: number, error: any = {}) => {
        res.status(responseCode).send(error);
    }

    protected noContentResponse = (res: Response) => {
        res.status(this.NO_CONTENT).send();
    }

    protected extractPaginationAttrsFromQuery = (query: any): IPaginationAttrs => {
        const page = (query.page) ? Number(query.page) : CommonConstants.DEFAULT_PAGINATION_ATTRS.PAGE;
        const limit = (query.limit) ? Number(query.limit) : CommonConstants.DEFAULT_PAGINATION_ATTRS.LIMIT;
        const offset = (page - 1) * limit;
        return { offset, limit };
    }

}
