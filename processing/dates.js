var _ = require("lodash");
var yr = require("yearrange");

module.exports = ukiyoe => {
    var validDate = date => {
        var valid = false;

        for (var prop in date) {
            if (prop !== "original") {
                valid = true;
                break;
            }
        }

        return valid ? date : undefined;
    };

    var correctDates = key => (data, scraper, callback) => {
        if (_.isArray(data[key])) {
            data[key].forEach((date, i) => {
                data[key][i] = validDate(yr.parse(date));
            });
        } else if (typeof data[key] === "string") {
            data[key] = validDate(yr.parse(data[key]));
        }

        process.nextTick(() => { callback(null, data); });
    };

    return {
        correctDates
    };
};