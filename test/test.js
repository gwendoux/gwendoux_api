require('must');
var request = require('supertest');
var app = require('../app');

describe("get links from Pinboard", function() {

    it("must return links from pinboard api", function() {
        return request(app).get('/v1/links')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});

describe("get photos from Instagram API", function() {
    it("must return at least 1 result with a specific hashtag", function() {
        return request(app).get('/v1/photos/tag/coffeeoftheday')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});

describe("test errors", function() {
    it("must return 404 for index page", function() {
        return request(app).get('/')
            .expect(404)
            .then(function(res) {
                res.must.exist();
                res.text.must.contain('error 404');
            });
    });

    it("must return 404 for random page", function() {
        return request(app).get('/random/page')
            .expect(404)
            .then(function(res) {
                res.must.exist();
                res.text.must.contain('error 404');
            });
    });
});
