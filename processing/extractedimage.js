var url = require("url");
var _ = require("lodash");
var async = require("async");

module.exports = (ukiyoe, stackScraper) => {
    var nameUtils = require("./names.js")(ukiyoe);
    var dateUtils = require("./dates.js")(ukiyoe);

    var saveImage = (baseURL, imageURL, s3Save, callback) => {
        imageURL = url.resolve(baseURL, imageURL);

        var resultHandler = (err, md5) => {
            if (stackScraper.options.debug) {
                if (err) {
                    console.error("Error processing image.");
                } else {
                    console.log("Image Processed:", imageURL, md5);
                }
            }

            callback(err, {
                imageURL,
                imageName: md5,
                _id: stackScraper.options.source + "/" + md5
            });
        };

        if (imageURL.indexOf("http") === 0) {
            if (stackScraper.options.debug) {
                console.log("Downloading Image:", imageURL);
            }

            ukiyoe.images.download(imageURL,
                stackScraper.options.sourceDataRoot, s3Save, resultHandler);
        } else {
            if (stackScraper.options.debug) {
                console.log("Processing Image:", imageURL);
            }

            // Handle a file differently, skip the download
            ukiyoe.images.processImage(imageURL,
                stackScraper.options.sourceDataRoot, s3Save, resultHandler);
        }
    };

    return {
        _id(data, scraper, callback) {
            data._id = stackScraper.options.source + "/" + data._id;
            callback(null, [data]);
        },

        price(data, scraper, callback) {
            if (data.sold === undefined) {
                data.forSale = true;
                data.sold = false;
            }
            callback(null, [data]);
        },

        dateCreated: dateUtils.correctDates("dateCreated"),
        datePublished: dateUtils.correctDates("datePublished"),

        artists: nameUtils.correctNames("artists"),
        publishers: nameUtils.correctNames("publishers"),
        carvers: nameUtils.correctNames("carvers"),
        depicted: nameUtils.correctNames("depicted"),

        images(data, scraper, callback) {
            async.mapLimit(data.images, 1, (image, callback) => {
                saveImage(data.url, image, !stackScraper.options.noSave,
                    callback);
            }, (err, imageDatas) => {
                if (err) {
                    return callback(err);
                }

                delete data.images;

                var related = _.pluck(imageDatas, "imageName");
                var source = stackScraper.options.source;

                callback(null, imageDatas.map(imageData => {
                    var clone = _.clone(data);

                    for (var prop in imageData) {
                        if (!(prop in clone)) {
                            clone[prop] = imageData[prop];
                        }
                    }

                    var getID = imageName => {
                        if (clone._ids) {
                            var pos = related.indexOf(imageName);
                            return pos > -1 ?
                                source + "/" + clone._ids[pos] :
                                "";
                        } else {
                            return source + "/" + imageName;
                        }
                    };

                    clone._id = getID(imageData.imageName);

                    clone.related = _.without(related, imageData.imageName);
                    clone.related = clone.related.map(getID);

                    return clone;
                }));
            });
        }
    };
};