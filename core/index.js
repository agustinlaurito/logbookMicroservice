'use strict';
console.log('\x1Bc');

const app = require('../app');
const errors = require('./helpers/errors');
const config = require('../config/default');


app.post('/logbook/:id/create', require('../core/controllers/logbook/create'));
app.get('/logbook/:id/get', require('../core/controllers/logbook/get'));


errors(app);



app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
});