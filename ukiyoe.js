var ukiyoe = require("ukiyoe-models");

ukiyoe.init(function() {
    require("stack-scraper").cli(function(args) {
        return {
            rootDataDir: __dirname + "/../ukiyoe-search/data/",
            scrapersDir: __dirname + "/scrapers/",
            model: ukiyoe.db.model(({
                images: "ExtractedImage",
                artists: "Bio"
            })[args.type]),
            postProcessors: require("./processing/" + args.type)(ukiyoe),
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