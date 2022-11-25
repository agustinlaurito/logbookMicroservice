'use strict';
console.log('\x1Bc');

const app = require('../app');
const errors = require('./helpers/errors');
const config = require('../config/default');


// app.get('/update', require('../core/controllers/update'));

errors(app);



app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
});