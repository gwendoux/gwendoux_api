
const app = require('../app');
//const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();

// get photos with a specific tag from a dedicated user
const instagram = require('./instagram');
app.route('/v1/photos/:tag')
   .get(instagram.tag);
app.route('/v1/photos/likes')
   .get(instagram.likes);

// get links from pinboard API or RSS
const pinboard = require('./pinboard');
app.route('/v1/links/feed')
    .get(pinboard.feed);
app.route('/v1/links/')
    .get(pinboard.getData);
