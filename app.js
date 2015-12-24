'use strict';
const express = require ('express');
const config = require('./lib/config');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = config.getLogger();

const app = module.exports = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('env', config.get('env'));
app.set('port', process.env.PORT || config.get('port'));

require('./routes');

app.listen(app.get('port'), function() {
    logger.info('Express server listening on port ' + app.get('port'));
});
