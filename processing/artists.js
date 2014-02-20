module.exports = function(ukiyoe) {
    var nameUtils = require("./names.js")(ukiyoe);

    return {
        "name": nameUtils.correctNames("name"),
        "aliases": nameUtils.correctNames("aliases")
    };
};