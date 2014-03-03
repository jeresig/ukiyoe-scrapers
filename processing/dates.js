var _ = require("lodash");
var yr = require("yearrange");

module.exports = function(ukiyoe) {
    var correctDates = function(key) {
        return function(data, scraper, callback) {
            if (_.isArray(data[key])) {
                data[key].forEach(function(date, i) {
                    data[key][i] = yr.parse(date);
                });
            } else {
                data[key] = yr.parse(data[key]);
            }

            process.nextTick(function() { callback(null, data); });
        };
    };

    return {
        correctDates: correctDates
    };
};