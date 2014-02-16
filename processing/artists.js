module.exports = function(options) {
    var nameUtils = require("./names.js")(options);

    return {
        "name": nameUtils.correctNames("name"),
        "aliases": nameUtils.correctNames("aliases")
    };
};