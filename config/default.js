module.exports = {
    port: process.env.PORT || 3002,
    connOpts: {
        defaultTimeout: 14000
    },
    operators: {
        eq: ':',
        gt: '>',
        lt: '<',
        gte: '>=',
        lte: '<=',
        ne: '!=',
        in: 'in',
        nin: 'nin',
        like: 'like',
        nlike: 'nlike',
    }
};
