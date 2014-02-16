var mongoose = require("mongoose");
var romajiName = require("romaji-name");
var stackScraper = require("stack-scraper");

// Load models
require("ukiyoe-models")(mongoose);

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    romajiName.init(function() {
        stackScraper.cli(function(args) {
           return {
                rootDataDir: __dirname + "/../ukiyoe-search/data/",
                scrapersDir: __dirname + "/scrapers/",
                model: mongoose.model(({
                    images: "ExtractedImage",
                    artists: "Bio"
                })[args.type]),
                postProcessors: require("./processing/" + args.type)({
                    mongoose: mongoose,
                    romajiName: romajiName
                }),
                directories: args.type === "images" ?
                    ["./images/", "./thumbs/", "./scaled/"] : []
            };
        }, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("DONE");
            }
            process.exit(0);
        });
    });
});