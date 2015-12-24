'use strict';

const app = require('../app');
const config = require('../lib/config');
const ig = require('instagram-node').instagram();
const escape = require('escape-html');
const moment = require('moment');
const bodyParser = require('body-parser');

const logger = config.getLogger();

ig.use({
    access_token: config.get('instagram_ACCESS_TOKEN'),
    client_id: config.get('instagram_CLIENT_ID'),
    client_secret: config.get('instagram_CLIENT_SECRET')
});


const jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: true }));

// get photos with a specific tag from a dedicated user
app.use('/api/photos/:tag', jsonParser, function(req, res) {
    ig.user_self_media_recent(function(err, result) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        let coffeeBeans = result.filter(function(photo) {
            return photo.tags.indexOf(req.params.tag) > -1;
        }).map(function(photo) {
            return {
                image_standard: photo.images.standard_resolution.url,
                caption: escape(photo.caption.text),
                date: moment(photo.created_time, 'X').fromNow()
            };
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(coffeeBeans, null, 2));
    });
});

// get photos liked from a dedicated user
app.use('/api/likes/', jsonParser, function(req, res) {
    ig.user_self_liked(function(err, data) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, 2));
    });
});

// get links from pinboard API or RSS
const pinboard = require('./pinboard');
app.route('/api/feed')
    .get(pinboard.feed);
app.route('/api/pin')
    .get(pinboard.getData);
