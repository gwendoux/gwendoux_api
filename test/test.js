require('must');
var request = require('supertest-as-promised');
var app = require('../app');

describe("get 404", function() {
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

describe("get links from Pinboard", function() {
    it("must return links from pinboard rss", function() {
        this.timeout(5000);
        return request(app).get('/v1/links/feed')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });

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
        return request(app).get('/v1/photos/coffeeoftheday')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });

    it("must return at least 1 result liked by the specific user", function() {
        return request(app).get('/v1/photos/likes')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});
