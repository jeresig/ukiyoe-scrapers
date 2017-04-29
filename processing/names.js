var _ = require("lodash");

module.exports = ukiyoe => {
    var nameCache = {};

    var lookupName = (name, options) => {
        if (name in nameCache) {
            return nameCache[name];
        }

        var results = ukiyoe.romajiName.parseName(name, options);
        nameCache[name] = results;
        return results;
    };

    var correctNames = key => (data, scraper, callback) => {
        if (_.isArray(data[key])) {
            data[key].forEach((name, i) => {
                data[key][i] = lookupName(name, scraper.nameOptions);
            });
        } else if (typeof data[key] === "string") {
            data[key] = lookupName(data[key], scraper.nameOptions);
        }

        process.nextTick(() => { callback(null, data); });
    };

    return {
        correctNames
    };
};