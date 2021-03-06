
const path = require('path');
const app_dir_path = path.join(__dirname, '..');
const app = require(app_dir_path + '/app');


app.get('/', function(req, res){
    res.status(404).sendFile(app_dir_path + '/template/404.html');
});
// get photos with a specific tag from a dedicated user
const instagram = require('./instagram');
app.route('/v1/photos/tag/:tag')
   .get(instagram.tag);
app.route('/v2/photos/')
      .get(instagram.getRecent);
// get links from pinboard API or RSS
const pinboard = require('./pinboard');
app.route('/v1/links/')
    .get(pinboard.recent);
app.route('/v2/links/')
    .get(pinboard.getRecent);

const feed = require('./feed');
app.route('/rss/xml')
    .get(feed.getXML);
app.route('/rss/json')
    .get(feed.getJSON);

app.get('*', function(req, res){
    res.status(404).sendFile(app_dir_path + '/template/404.html');
});
