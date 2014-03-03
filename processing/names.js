var _ = require("lodash");

module.exports = function(ukiyoe) {
    var nameCache = {};

    var lookupName = function(name, options) {
        if (name in nameCache) {
            return nameCache[name];
        }

        var results = ukiyoe.romajiName.parseName(name, options);
        nameCache[name] = results;
        return results;
    };

    var correctNames = function(key) {
        return function(data, scraper, callback) {
            if (_.isArray(data[key])) {
                data[key].forEach(function(name, i) {
                    data[key][i] = lookupName(name, scraper.nameOptions);
                });
            } else {
                data[key] = lookupName(data[key], scraper.nameOptions);
            }

            process.nextTick(function() { callback(null, data); });
        };
    };

    return {
        correctNames: correctNames
    };
};