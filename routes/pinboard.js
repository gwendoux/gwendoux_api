
const parser = require('parse-rss');
const request = require('request');
const config = require('../lib/config');
const url = require('url');
const escape = require('escape-html');

const redis = require("redis");
const client = redis.createClient();

const logger = config.getLogger();
const Pinboard_data = config.get('pinboard_feed_url');

const Pinboard_API_Token = config.get('pinboard_API_TOKEN');
const Pinboard_API_Endpoint = 'https://api.pinboard.in/v1/posts/recent?auth_token=' + Pinboard_API_Token + '&format=json&count=12';

function feed(req, res) {
    parser(Pinboard_data, function(err, json) {
        if (err) {
            throw err;
        }
        var dataFeed = json.slice(0, 3).map(function(json) {
            return {
                title: escape(json.title),
                desc: escape(json.description),
                url: json.link,
                date: json.date,
                source: url.parse(json.link,true).host
            };
        });
        res.setHeader('Content-Type', 'application/json');
        res.jsonp(dataFeed);
    });
}

function getData(req, res) {
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
                content = JSON.parse(data).posts;
                res.jsonp(content);
            });
        } else {
            request.get(Pinboard_API_Endpoint, function (err, response, data) {
                if(err) {
                    throw err;
                }
                content = JSON.parse(data).posts;
                client.hset('items', 'items', data);
                // set expiration to 2 minutes
                // pinboard allows 1 call/minute
                client.expire('items', 120);
                res.jsonp(content);

            });
        }
    });
}

exports.feed = feed;
exports.getData = getData;
