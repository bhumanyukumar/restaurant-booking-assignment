export default {
    body: {
        type: 'object',
        required: ['tables'],
        properties: {
            tables: {
                type: 'object',
                required: ['from', 'to'],
                additionalProperties: false,
                properties: {
                    from: { type: 'string', format: 'iso-date' },
                    to: { type: 'string', format: 'iso-date' },
                },
            },
        },
    },
    query: null,
    params: null,
};
