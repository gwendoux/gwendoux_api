require('must');
var request = require('supertest-as-promised');
//var config = require('../lib/config');
var app = require('../app');

describe("get links from pinboard rss feed", function() {
    it("must return links", function() {
        this.timeout(5000);
        return request(app).get('/api/feed')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});

describe("get links from pinboard api", function() {
    it("must return links", function() {
        return request(app).get('/api/pin')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});

describe("get photos from instagram with a specific hashtag", function() {
    it("must return at least 1 result", function() {
        return request(app).get('/api/photos/coffeeoftheday')
            .expect('Content-Type', 'text/plain')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});


describe("get photos liked by the specific user", function() {
    it("must return at least 1 result", function() {
        return request(app).get('/api/likes')
            .expect('Content-Type', 'text/plain')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});
