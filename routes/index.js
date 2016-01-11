
const app = require('../app');
//const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();

// get photos with a specific tag from a dedicated user
const instagram = require('./instagram');
app.route('/api/photos/:tag')
   .get(instagram.tag);
app.route('/api/likes/')
   .get(instagram.likes);

// get links from pinboard API or RSS
const pinboard = require('./pinboard');
app.route('/api/feed')
    .get(pinboard.feed);
app.route('/api/pin')
    .get(pinboard.getData);
