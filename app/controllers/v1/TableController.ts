import { NextFunction, Request, Response } from 'express';
import TableService from '../../services/TableService';
import BaseController from '../BaseController';

export default class TableController extends BaseController {

    constructor(private tableService: TableService) {
        super();
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let table = { ...req.body.table };
            table = await this.tableService.create(table);
            return this.successResponse(res, { table });
        } catch (error) {
            next(error);
        }
    }

    public getAllTables = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paginationAttrs = this.extractPaginationAttrsFromQuery(req.query);
            const tables = await this.tableService.getTables({}, paginationAttrs);
            return this.successResponse(res, { tables });
        } catch (error) {
            next(error);
        }
    }

    public getAvailableTables = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paginationAttrs = this.extractPaginationAttrsFromQuery(req.query);
            const availableTables = await this.tableService.getAvailableTables(
                req.body.tables, paginationAttrs,
            );
            return this.successResponse(res, { tables: availableTables });
        } catch (error) {
            next(error);
        }
    }

}
