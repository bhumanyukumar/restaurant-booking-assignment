export default {
    body: {
        type: 'object',
        required: ['reservation'],
        properties: {
            reservation: {
                type: 'object',
                required: ['table', 'from', 'to'],
                additionalProperties: false,
                properties: {
                    table: {
                        type: 'object',
                        required: ['_id'],
                        properties: {
                            _id: { type: 'string', format: 'object-id' },
                            capacity: { type: 'integer' },
                        },
                    },
                    from: { type: 'string', format: 'iso-date' },
                    to: { type: 'string', format: 'iso-date' },
                },
            },
        },
    },
    query: null,
    params: null,
};
