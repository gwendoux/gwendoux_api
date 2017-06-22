const config = require('../lib/config');
const logger = config.getLogger();
const models = require('../lib/models');
const _ = require('underscore');

const this_year = new Date().getFullYear();

function getRecentPhotos() {
    return models.Coffee.find({}).limit(20).sort({date: -1})
    .then(function(data){
        var result = [];
        var n = 0;
        data.forEach(function(item) {
            result[n++] = {
                id: item.id,
                title: item.caption,
                description: '<img src="' + item.image.url + '" title="' + item.caption + '" />',
                date: item.date,
                link: item.origlink // send to original link
            };
        });
        return result;
    })
    .catch(function(err) {
        logger.error(err);
    });
}
//rest = _.sortBy(_.rest(opportunities_EP_ci).concat(_.rest(opportunities_EP_fi, 2)), 'date');
function getRecentPosts() {
    return models.Links.find({}).limit(20).sort({date: -1})
    .then(function(data){
        var result = [];
        var n = 0;
        data.forEach(function(item) {
            result[n++] = {
                id: item.id,
                title: item.title,
                description: item.description,
                date: item.date,
                link: item.url // send to original link
            };
        });
        return result;
    })
    .catch(function(err) {
        logger.error(err);
    });
}


function getXML(req, res, next) {
    Promise.all([getRecentPosts(), getRecentPhotos()])
    .then(function(data) {
        var items = _.sortBy(data[0].concat(data[1]), 'date').reverse();
        return items;
    }).then(function(items) {
        items = items.slice(0,19);
        return items;
    }).then(function(items) {
        res.set('Content-Type', 'application/rss+xml');
        res.render('rss.html', {"year": this_year, "items": items});
    }).catch(function(error) {
        logger.error(error);
    });
}

exports.getXML = getXML;
// exports.getJSON = getJSON;
