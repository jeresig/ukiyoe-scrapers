var crypto = require("crypto");

module.exports = (ukiyoe, stackScraper) => {
    var nameUtils = require("./names.js")(ukiyoe);
    var dateUtils = require("./dates.js")(ukiyoe);

    return {
        _id(data, scraper, callback) {
            data._id = stackScraper.options.source + "/" + data._id;
            process.nextTick(() => { callback(null, data); });
        },
        name(data, scraper, callback) {
            nameUtils.correctNames("name")(data, scraper, (err, data) => {
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
        aliases: nameUtils.correctNames("aliases"),
        life: dateUtils.correctDates("life"),
        active: dateUtils.correctDates("active")
    };
};