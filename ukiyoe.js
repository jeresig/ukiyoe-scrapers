var ukiyoe = require("ukiyoe-models");

ukiyoe.init(function() {
    require("stack-scraper").cli(function(args) {
        if (!ukiyoe.models[args.type]) {
            console.error("Error: Invalid model type:", args.type);
            process.exit(1);
        }

        return {
            rootDataDir: __dirname + "/../ukiyoe-search/data/",
            scrapersDir: __dirname + "/scrapers/",
            model: ukiyoe.models[args.type],
            postProcessors: require("./processing/" + args.type)(ukiyoe),
            directories: args.type === "extractedimage" ?
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