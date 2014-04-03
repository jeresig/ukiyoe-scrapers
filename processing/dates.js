var _ = require("lodash");
var yr = require("yearrange");

module.exports = function(ukiyoe) {
    var validDate = function(date) {
        var valid = false;

        for (var prop in date) {
            if (prop !== "original") {
                valid = true;
                break;
            }
        }

        return valid ? date : undefined;
    };

    var correctDates = function(key) {
        return function(data, scraper, callback) {
            if (_.isArray(data[key])) {
                data[key].forEach(function(date, i) {
                    data[key][i] = validDate(yr.parse(date));
                });
            } else {
                data[key] = validDate(yr.parse(data[key]));
            }

            process.nextTick(function() { callback(null, data); });
        };
    };

    return {
        correctDates: correctDates
    };
};