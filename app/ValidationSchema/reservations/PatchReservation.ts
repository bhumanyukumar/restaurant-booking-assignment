export default {
    body: {
        type: 'object',
        required: [],
        properties: {
            reservation: {
                type: 'object',
                required: ['_id'],
                properties: {
                    _id: { type: 'string', format: 'object-id' },
                    table: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string', format: 'object-id' },
                            capacity: { type: 'integer' },
                        },
                    },
                    status: { type: 'string', format: 'iso-date' },
                    from: { type: 'string', format: 'iso-date' },
                    to: { type: 'string', format: 'iso-date' },
                },
            },
        },
    },
    query: null,
    params: {
        type: 'object',
        required: ['reservationId'],
        properties: {
            reservationId: { type: 'string', format: 'object-id' },
        },
    },
};
