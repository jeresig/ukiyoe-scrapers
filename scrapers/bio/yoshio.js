var hepburn = require("hepburn");

module.exports = options => ({
    files: [
        "asahi/kato/yoshio/aiueo-zenesi/*/*.html",
        "asahi/kato/yoshio/kobetuesi/*.html"
    ],

    scrape: [
        {
            extract: {
                name: ["(//td[@width='480']/font[@color='blue'])[1]", (val, data) => {
                    val = val.replace(/☆\s*/g, "");
                    val = val.replace(/、/g, " ");
                    val = options.romajiName.stripParens(val);

                    if (/([\u3041-\u3096\u30A0-\u30FF（）\s]+)\s/.test(val)) {
                        var kana = RegExp.$1.trim();
                        var romaji = hepburn.fromKana(kana);

                        // It's written backwards!
                        romaji = options.romajiName.flipName(romaji);

                        // Handle generations
                        var gen = {};
                        options.romajiName.extractGeneration(val, gen);

                        if (gen && gen.generation) {
                            romaji += " " + gen.generation;
                        }

                        val = val.replace(kana, romaji + " ");
                        // Fix a couple stupid mistakes
                        val = val.replace("KUTAGAWA", "UTAGAWA");

                        return options.romajiName.parseName(val);
                    }

                    // Don't return anything if there's no kana name
                }],

                aliases: "//td[@width='480']/font[@color='red']",

                life: "(//td[@width='480']/font[@color='blue'])[2]",

                url(data) {
                    if (!data.url && data.savedFile) {
                        if (/([^\/]+).html/.test(data.savedFile)) {
                            data._id = RegExp.$1;
                            if (/kobetuesi/.test(data.savedFile)) {
                                data._id = "kobetuesi-" + data._id;
                            }
                            return "http://www.ne.jp/" + data.savedFile;
                        }
                    }
                    return data.url;
                }
            }
        }
    ],

    accept(data) {
        return !!data.name && !!data.name.name &&
            // Reject artists that are just an alias for another
            !data.aliases &&
            // Reject artists with an explict unknown date
            (!data.life || !/〔未詳〕/.test(data.life));
    }
});
