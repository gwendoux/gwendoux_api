
const config = require('../lib/config');

const ig = require('instagram-node').instagram();
const escape = require('escape-html');
const moment = require('moment');
const logger = config.getLogger();

ig.use({
    access_token: config.get('instagram_ACCESS_TOKEN'),
    client_id: config.get('instagram_CLIENT_ID'),
    client_secret: config.get('instagram_CLIENT_SECRET')
});

// get photos with a specific tag from a dedicated user
function tag(req, res) {
    ig.user_self_media_recent(function(err, result) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        var coffeeBeans = result.filter(function(photo) {
            return photo.tags.indexOf(req.params.tag) > -1;
        }).map(function(photo) {
            return {
                image_standard: photo.images.standard_resolution.url,
                caption: escape(photo.caption.text),
                date: moment(photo.created_time, 'X').fromNow()
            };
        });
        res.setHeader('Content-Type', 'application/json');
        res.jsonp(coffeeBeans);
    });
}

// get photos liked from a dedicated user
function likes(req, res) {
    ig.user_self_liked(function(err, data) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        res.setHeader('Content-Type', 'application/json');
        res.jsonp(data);
    });
}

exports.tag = tag;
exports.likes = likes;
