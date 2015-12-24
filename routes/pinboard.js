'use strict';
const parser = require('parse-rss');
const request = require('request');
const moment = require('moment');
const config = require('../lib/config');
const url = require('url');
const escape = require('escape-html');

const logger = config.getLogger();
const Pinboard_data = config.get('pinboard_feed_url');

const Pinboard_API_Token = config.get('pinboard_API_TOKEN');
const Pinboard_API_Endpoint = 'https://api.pinboard.in/v1/posts/recent?auth_token=' + Pinboard_API_Token + '&format=json';

function feed(req, res) {
    parser(Pinboard_data, function(err, json) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        let dataFeed = json.slice(0, 3).map(function(json) {
            return {
                title: escape(json.title),
                desc: escape(json.description),
                url: json.link,
                date: moment(json.date).fromNow(),
                source: url.parse(json.link,true).host
            };
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dataFeed, null, 2));
    });
}

function getData(req, res) {
    request.get(Pinboard_API_Endpoint, function (err, response, data) {
        if(err) {
            throw err;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
    });
}

exports.feed = feed;
exports.getData = getData;
