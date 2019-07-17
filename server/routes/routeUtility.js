const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');


router.get('/scrape', function (req, res, next) {
    if (req.query.url) {
        request(req.query.url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(body);
                const title = $("title").text();
                const description = $('meta[name=description]').attr("content");
                res.send({
                    title: title,
                    metaDescription: description
                });
            }
        });
    }
});


module.exports = router;
