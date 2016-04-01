
const config = require('../lib/config');
const utilities = require('../lib/photos-utilities');
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
                filterRequest = utilities.filterDataByTag(result, req.params.tag);
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
        var filterRequest = utilities.filterData(result);
        res.setHeader('Content-Type', 'application/json');
        res.jsonp(filterRequest);
    });
}

exports.tag = tag;
exports.likes = likes;
