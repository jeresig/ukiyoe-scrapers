var url = require("url");
var _ = require("lodash");
var nameUtils = require("./names.js");

var saveImage = function(baseURL, imageURL, callback) {
    imageURL = url.resolve(baseURL, imageURL);

    var resultHandler = function(err, md5) {
        callback(err, {
            imageURL: imageURL,
            imageName: md5
        });
    };

    if (imageURL.indexOf("http") === 0) {
        site.images.download(imageURL, site.dirs.base, resultHandler);
    } else {
        // Handle a file differently, skip the download
        site.images.processImage(imageURL, site.dirs.base, resultHandler);
    }
};

module.exports = {
    "artists": nameUtils.correctNames("artists"),
    "publisher": nameUtils.correctNames("publisher"),
    "carver": nameUtils.correctNames("publisher"),
    "depicted": nameUtils.correctNames("depicted"),

    "images": function(data, scraper, callback) {
        async.map(data.images, function(image, callback) {
            saveImage(data.url, image, callback);
        }, function(err, imageDatas) {
            if (err) {
                return callback(err);
            }

            var related = _.pluck(imageDatas, "imageName");

            callback(null, imageDatas.map(function(imageData) {
                return _.extend({}, data, imageData, {
                    related: _.without(related, imageData.imageName)
                });
            }));
        });
    }
};