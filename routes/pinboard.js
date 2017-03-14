const moment = require('moment');
const request = require('request');
const config = require('../lib/config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var links = mongoose.createConnection('mongodb://localhost/links');
var Links = links.model('Links', new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    url: String,
    tags: String,
    date: Date,
    shared: Boolean
}));

const redis = require("redis");
const client = redis.createClient({no_ready_check: true});

const logger = config.getLogger();

const Pinboard_API_Token = config.get('pinboard_API_TOKEN');
const Pinboard_API_Endpoint = 'https://api.pinboard.in/v1/posts/recent?auth_token=' + Pinboard_API_Token + '&format=json&count=12';

function recent(req, res, next) {
    var content;
    client.on('error', function (err) {
        logger.debug('Error:', err);
    });
    res.setHeader('Content-Type', 'application/json');
    client.exists('items', function(err, reply) {
        if (reply === 1) {
            client.hget('items', 'items', function(err, data) {
                if(err) {
                    logger.debug(err);
                }
                content = JSON.parse(data);
                res.jsonp(content);
            });
        } else {
            request.get(Pinboard_API_Endpoint, function (err, response, data) {
                if(err) {
                    return next(err);
                }
                content = JSON.parse(data).posts;
                content.map(function(item) {
                    item.since = moment(item.time).fromNow();
                });
                client.hset('items', 'items', JSON.stringify(content));
                client.expire('items', 600);
                res.jsonp(content);
            });
        }
    });
}

function getRecent(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    Links.find({}).limit(12).sort({date: -1})
    .then(function(data){
        res.jsonp(data);
    })
    .catch(function(err) {
        logger.debug(err);
    });
}

exports.recent = recent;
exports.getRecent = getRecent;
