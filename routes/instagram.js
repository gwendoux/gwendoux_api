const config = require('../lib/config');
const utilities = require('../lib/photos-utilities');
const ig = require('instagram-node').instagram();
const logger = config.getLogger();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var coffee = mongoose.createConnection('mongodb://localhost/coffee');

var Coffee = coffee.model('Coffee', new mongoose.Schema({
    id: String,
    caption: String,
    image: {
        url: String,
        standard: {
            url: String,
            width: Number,
            height: Number
        },
        thumbnail: {
            url: String,
            width: Number,
            height: Number
        }
    },
    likes: Number,
    origlink: String,
    date: Date
}));


const redis = require("redis");
const client = redis.createClient({no_ready_check: true});

// get photos with a specific tag from a dedicated user
function tag (req, res, next) {
    var filterRequest;
    res.setHeader('Content-Type', 'application/json');
    client.exists('photos', function(err, reply) {
        if (reply === 1) {
            logger.info('cache exist');
            client.hget('photos', req.params.tag, function(err, data) {
                if(err) {
                    return next(err);
                }
                filterRequest = JSON.parse(data);
                res.jsonp(filterRequest);
            });
        } else {
            Coffee.find({}).limit(6).sort({date: -1})
            .then(function(data){
                res.jsonp(data);
            })
            .catch(function(err) {
                logger.debug(err);
            });
            logger.info('cache does not exist');
            logger.debug('tag', req.params.tag);
            ig.user_self_media_recent(function(err, result) {
                if (err) {
                    return next(err);
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

function getRecent (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    Coffee.find({}).limit(6).sort({date: -1})
    .then(function(data){
        res.jsonp(data);
    })
    .catch(function(err) {
        logger.debug(err);
    });
}

exports.tag = tag;
exports.getRecent = getRecent;
