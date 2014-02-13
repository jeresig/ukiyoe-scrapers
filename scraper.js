var mongoose = require("mongoose");
var romajiName = require("romaji-name");
var ArgumentParser = require("argparse").ArgumentParser;

// Load models
require("ukiyoe-models")(mongoose);

var pkg = require("./package");

var argparser = new ArgumentParser({
    description: pkg.description,
    version: pkg.version,
    addHelp: true
});

argparser.addArgument(["type"], {
    help: "Type of scraper to load (e.g. 'images' or 'artists')."
});

argparser.addArgument(["source"], {
    help: "The name of the source to download (e.g. 'ndl')."
});

argparser.addArgument(["--scrape"], {
    action: "storeTrue",
    help: "..."
});

argparser.addArgument(["--process"], {
    action: "storeTrue",
    help: "..."
});

argparser.addArgument(["--update"], {
    action: "storeTrue",
    help: "..."
});

argparser.addArgument(["--reset"], {
    action: "storeTrue",
    help: "..."
});

argparser.addArgument(["--debug"], {
    action: "storeTrue",
    help: "..."
});

var args = argparser.parseArgs();

var scrapeSource = function(source, callback) {
    require("stack-scraper").run(_.extend({}, args, {
        source: source,
        rootDataDir: "./data/",
        scrapersDir: "./scrapers/",
        model: mongoose.model(({
            images: "ExtractedImage",
            artists: "Bio"
        })[args.type]),
        postProcessors: require("./processing/" + args.type),
        directories: args.type === "images" ?
            ["./images/", "./thumbs/", "./scaled/"] : []
    }));
};

var done = function(err) {
    if (err) {
        console.error(err);
    } else {
        console.log("DONE");
    }
    process.exit(0);
};

mongoose.createConnection('mongodb://localhost/extract', function() {
    romajiName.init(function() {
        if (args.source === "*") {
            fs.readdir("./scrapers/" + args.type, function(err, sources) {
                async.mapLimit(sources, 1, scrapeSource, done);
            });
        } else {
            initSite(args.source, done);
        }
    });
});