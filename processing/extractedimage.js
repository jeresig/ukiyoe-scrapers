"use strict";

const fs = require("fs");
const path = require("path");
const url = require("url");

const _ = require("lodash");
const async = require("async");
const request = require("request");

module.exports = (ukiyoe, stackScraper) => {
    const getNameFromURL = (imageURL) =>
        path.basename(url.parse(imageURL).pathname);

    const saveImage = (baseURL, imageURL, s3Save, callback) => {
        imageURL = url.resolve(baseURL, imageURL);

        const resultHandler = (err, imageFileName) => {
            if (stackScraper.options.debug) {
                if (err) {
                    console.error("Error processing image.");
                } else {
                    console.log("Image Processed:", imageURL, imageFileName);
                }
            }

            callback(err, imageFileName);
        };

        if (imageURL.indexOf("http") === 0) {
            if (stackScraper.options.debug) {
                console.log("Downloading Image:", imageURL);
            }

            const imageFileName = stackScraper.scraper.imageFileName
                ? stackScraper.scraper.imageFileName(imageURL)
                : getNameFromURL(imageURL);

            const imageFile = path.resolve(
                stackScraper.options.imagesDir,
                imageFileName
            );

            request(imageURL)
                .pipe(fs.createWriteStream(imageFile))
                .on("close", () => {
                    resultHandler(null, imageFileName);
                });
        } else {
            if (stackScraper.options.debug) {
                console.log("Processing Image:", imageURL);
            }

            // Handle a file differently, skip the download
            // TODO(jeresig): Rewrite this.
            //ukiyoe.images.processImage(imageURL,
            //    stackScraper.options.sourceDataRoot, s3Save, resultHandler);
        }
    };

    return {
        price(data, scraper, callback) {
            if (data.sold === undefined) {
                data.forSale = true;
                data.sold = false;
            }
            callback(null, [data]);
        },

        images(data, scraper, callback) {
            async.mapLimit(data.images, 1, (image, callback) => {
                saveImage(data.url, image, !stackScraper.options.noSave,
                    callback);
            }, (err, imageFileNames) => {
                if (err) {
                    return callback(err);
                }

                delete data.images;

                callback(null, imageFileNames.map((imageFileName) => {
                    const clone = _.clone(data);

                    clone._id = imageFileName;
                    clone.imageName = imageFileName;

                    clone.related = _.without(imageFileNames, imageFileName);

                    return clone;
                }));
            });
        },
    };
};
