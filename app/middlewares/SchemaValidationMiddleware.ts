import Ajv from 'ajv';
import moment from 'moment';
import { Types } from 'mongoose';

export default class ValidationMiddleware {

    public static validate(schema: any) {

        return async (req, res, next) => {
            const ajv = new Ajv({ allErrors: true, useDefaults: true });
            ValidationMiddleware.addCustomFormats(ajv);

            const componentsToValidate = ['body', 'query', 'params', 'headers'];
            for (const component of componentsToValidate) {
                if (schema[component]) {
                    const valid = ajv.validate(schema[component], req[component]);
                    if (!valid) {
                        return ValidationMiddleware.sendErrorReposne(res, ajv.errors, component);
                    }
                }
            }
            next();
        };
    }

    private static addCustomFormats = (ajv) => {
        ajv.addFormat('date-time', {
            validate: (dateTimeString) => {
                return moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss', true).isValid();
            },
        });

        ajv.addFormat('iso-date', {
            validate: (dateTimeString) => {
                const date = new Date(dateTimeString);
                if (date.getTime() !== date.getTime()) {
                    return false;
                }
                return (date.toISOString() === dateTimeString);
            },
        });

        ajv.addFormat('timezone', {
            validate: (timezoneString) => {
                return timezoneString.match('^(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$');
            },
        });

        ajv.addFormat('object-id', {
            validate: (objectId: string) => {
                return Types.ObjectId.isValid(objectId);
            },
        });

        ajv.addKeyword('maxNumberString', {
            metaSchema: {
                type: 'number',
            },
            errors: true,
            validate: ((maxLimit: number, limit: string) => {
                if (Number(limit) > maxLimit) {
                    return false;
                }
                return true;
            }),
        });

        ajv.addFormat('string-object-ids', {
            validate: (objectIds: string) => {
                const idsArr = objectIds.split(',');
                for (const objId of idsArr) {
                    if (!Types.ObjectId.isValid(objId)) {
                        return false;
                    }
                }
                return true;
            },
        });

        ajv.addKeyword('commaSeparatedEnums', {
            metaSchema: {
                type: 'array',
            },
            errors: true,
            validate: (function(constants, parentSchema) {
                const includeStrings = parentSchema.split(',');
                for (const includeString of includeStrings) {
                    if (!constants.includes(includeString)) {
                        if (this.errors === null) {
                            this.errors = [];
                        }
                        this.errors.push({
                            keyword: 'commaSeparatedEnums',
                            message: 'should contain only the allowed values',
                            params: {
                                allowedValues: constants,
                            },
                        });
                        return false;
                    }
                }
                return true;
            }),
        });

        ajv.addFormat('integer-string', {
            validate: (numberString) => {
                return numberString.match('^[0-9]*$');
            },
        });
    }

    private static sendErrorReposne(res, errors, component: string) {
        return res.status(422).send({
            error: {
                description: `Invalid request ${component}`,
                fields: errors,
            },
        });
    }
}
