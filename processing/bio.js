var crypto = require("crypto");

module.exports = function(ukiyoe, stackScraper) {
    var nameUtils = require("./names.js")(ukiyoe);

    return {
        _id: function(data, scraper, callback) {
            data._id = stackScraper.options.source + "/" + data._id;
            process.nextTick(function() { callback(null, data); });
        },
        name: function(data, scraper, callback) {
            nameUtils.correctNames("name")(data, scraper, function(err, data) {
                if (data && !data._id) {
                    // Set the ID
                    var hash = crypto.createHash("sha1");
                    hash.update(data.name.original, "utf8");
                    data._id = stackScraper.options.source + "/" +
                        hash.digest("hex");
                }
                callback(err, data);
            });
        },
        aliases: nameUtils.correctNames("aliases")
    };
};