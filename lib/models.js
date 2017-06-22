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


exports.Links = Links;
exports.Coffee = Coffee;
