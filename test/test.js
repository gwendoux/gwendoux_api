require('must');
var request = require('supertest-as-promised');
var app = require('../app');

describe("get links from Pinboard", function() {
    it("must return links from pinboard rss", function() {
        this.timeout(5000);
        return request(app).get('/api/feed')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });

    it("must return links from pinboard api", function() {
        return request(app).get('/api/pin')
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
        return request(app).get('/api/photos/coffeeoftheday')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });


    it("must return at least 1 result liked by the specific user", function() {
        return request(app).get('/api/likes')
            .expect(200)
            .then(function(res) {
                res.must.be.json;
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});
