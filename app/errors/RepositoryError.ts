export default class RepositoryError extends Error {
    public code: string;
    public data: any;

    constructor(code: string, message: string = '', data: any = {}) {
        super(message);
        this.code = code;
        this.data = data;
        this.name = 'RepositoryError';
    }
}
