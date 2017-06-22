
const express = require ('express');
const path = require('path');
const config = require('./lib/config');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = config.getLogger();
const nunjucks = require('nunjucks');

const app = module.exports = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function error(err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send({ error: 'Something failed!' });
});
app.set('views', path.join(__dirname, 'template'));

nunjucks.configure('template', {
    express: app,
    autoescape: true
});
app.set('view engine', 'html');

app.set('env', config.get('env'));
app.set('port', process.env.PORT || config.get('port'));

require('./routes');

app.listen(app.get('port'), function() {
    logger.info('Express server listening on port ' + app.get('port'));
});
