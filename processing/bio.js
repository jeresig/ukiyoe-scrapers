var crypto = require("crypto");

module.exports = function(ukiyoe, stackScraper) {
    var nameUtils = require("./names.js")(ukiyoe);

    return {
        name: nameUtils.correctNames("name"),
        aliases: nameUtils.correctNames("aliases"),
        _id: function(data, scraper, callback) {
            // Set the ID
            var hash = crypto.createHash("sha1");
            hash.update(data.name.original, "utf8");
            data._id = stackScraper.options.source + "/" + hash.digest("hex");
            process.nextTick(function() { callback(null, data); });
        }
    };
};