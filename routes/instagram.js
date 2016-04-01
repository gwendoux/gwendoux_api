
const config = require('../lib/config');

const ig = require('instagram-node').instagram();
const escape = require('escape-html');
const logger = config.getLogger();

const redis = require("redis");
const client = redis.createClient();

ig.use({
    access_token: config.get('instagram_ACCESS_TOKEN'),
    client_id: config.get('instagram_CLIENT_ID'),
    client_secret: config.get('instagram_CLIENT_SECRET')
});

// get photos with a specific tag from a dedicated user
function tag(req, res) {

    var filterRequest;
    res.setHeader('Content-Type', 'application/json');
    client.exists('photos', function(err, reply) {
        if (reply === 1) {
            logger.info('cache exist');
            client.hget('photos', req.params.tag, function(err, data) {
                if(err) {
                    logger.debug(err);
                }
                filterRequest = JSON.parse(data);
                res.jsonp(filterRequest);
            });
        } else {
            logger.info('cache does not exist');
            logger.debug('tag', req.params.tag);
            ig.user_self_media_recent(function(err, result) {
                if (err) {
                    throw err;
                }
                filterRequest = filterDataByTag(result, req.params.tag);
                client.hset('photos', req.params.tag, JSON.stringify(filterRequest));
                // set expiration to one day
                // instagram photos does not need to update too often
                client.expire('photos', 86400);
                res.jsonp(filterRequest);

            });
        }
    });
}

// get photos liked from a dedicated user
function likes(req, res) {
    ig.user_self_liked(function(err, result) {
        if (err) {
            throw err;
        }
        var filterRequest = filterData(result);
        res.setHeader('Content-Type', 'application/json');
        res.jsonp(filterRequest);
    });
}

function filterDataByTag(result, tag) {
    return filterData(result.filter(function(photo) {
        return photo.tags.indexOf(tag) > -1;
    }));
}

function filterData(result) {
    // only return images not videos
    return result.filter(function(photo) {
        return photo.type.indexOf('image') > -1;
    }).map(function(photo) {
        return {
            image: {
                standard: photo.images.standard_resolution.url,
                thumbnail: photo.images.thumbnail.url,
                caption: photo.caption ? escape(photo.caption.text) : "",
                origlink: photo.link,
                date: photo.created_time
            },
            user: {
                username: photo.user.username,
                profile_picture: photo.user.profile_picture
            }
        };
    });
}



exports.tag = tag;
exports.likes = likes;
