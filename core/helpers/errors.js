'use strict';

const _ = require('lodash');
const http = require('http-constants');
const errors = require('http-errors');

const statuses = _.values(http.codes);

const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';
const DEFAULT_ERROR_STATUS = http.codes.INTERNAL_SERVER_ERROR;

function handle (app) {
    // Handle 404
    app.use((req, res, next) => {
        res.status(http.codes.NOT_FOUND).send((new errors.NotFound('Not found')).toJson());
    });

    // Handle uncached errors
    app.use((error, req, res, next) => {
        console.log(error);

        const message = (error && error.message) || DEFAULT_ERROR_MESSAGE;
        let status = Number((error && (error.status || error.statusCode || error.responseCode || error.code)) || DEFAULT_ERROR_STATUS);

        // Check if status is a valid http status code
        if (!statuses.includes(status)) {
            status = DEFAULT_ERROR_STATUS;
        }
        error = {
            code: status,
            error: message,
        };
        return res.status(status).send(error);
    });
}

module.exports = handle;
