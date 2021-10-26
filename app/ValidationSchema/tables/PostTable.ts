export default {
    body: {
        type: 'object',
        required: ['table'],
        properties: {
            table: {
                type: 'object',
                required: ['number', 'capacity'],
                additionalProperties: false,
                properties: {
                    number: { type: 'integer' },
                    capacity: { type: 'integer' },
                },
            },
        },
    },
    query: null,
    params: null,
};
