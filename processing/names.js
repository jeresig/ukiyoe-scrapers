var _ = require("lodash");

module.exports = function(conf) {
    var nameCache = {};

    var lookupName = function(name, options) {
        if (name in nameCache) {
            return nameCache[name];
        }

        var results = conf.romajiName.parseName(name, options);
        nameCache[name] = results;
        return results;
    };

    var correctNames = function(key) {
        return function(data, scraper, callback) {
            if (_.isArray(data[key])) {
                data[key].forEach(function(name, i) {
                    applyChange("Name", data[key], i,
                        lookupName(name, scraper.nameOptions));
                });
            } else {
                applyChange("Name", data, key,
                    lookupName(data[key], scraper.nameOptions));
            }

            process.nextTick(function() { callback(null, data); });
        };
    };

    var applyChange = function(schemaName, obj, prop, data) {
        var value = obj[prop];

        if (typeof value !== typeof data) {
            obj[prop] = data;
            return;
        }

        var schema = conf.mongoose.model(schemaName);

        for (var key in value) {
            if (value.hasOwnProperty(key) && key in schema &&
                    data[key] !== value[key]) {
                value[key] = data[key];
            }
        }
    };

    return {
        correctNames: correctNames
    };
};