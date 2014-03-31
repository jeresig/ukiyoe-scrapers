var ukiyoe = require("ukiyoe-models");

ukiyoe.init(function() {
    require("stack-scraper").cli(function(args, stackScraper) {
        if (!ukiyoe.models[args.type]) {
            console.error("Error: Invalid model type:", args.type);
            process.exit(1);
        }

        return {
            rootDataDir: __dirname + "/data/",
            scrapersDir: __dirname + "/scrapers/",
            model: ukiyoe.models[args.type],
            logModel: ukiyoe.models.scrapelog,
            postProcessors: require("./processing/" + args.type)(
                ukiyoe, stackScraper),
            directories: args.type === "extractedimage" ?
                {
                    imagesDir: "./images/",
                    thumbsDir: "./thumbs/",
                    scaledDir: "./scaled/"
                } : {},
            romajiName: ukiyoe.romajiName
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
