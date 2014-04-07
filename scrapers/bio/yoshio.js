var hepburn = require("hepburn");

module.exports = function(options) {
    return {
        files: [
            "asahi/kato/yoshio/aiueo-zenesi/*/*.html",
            "asahi/kato/yoshio/kobetuesi/*.html"
        ],
        scrape: [
            {
                extract: {
                    name: ["(//td[@width='480']/font[@color='blue'])[1]", function(val, data) {
                        val = val.replace(/☆\s*/g, "");
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

                            return val;
                        }

                        // Don't return anything if there's no kana name
                    }],

                    life: "(//td[@width='480']/font[@color='blue'])[2]",

                    url: function(data) {
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

        accept: function(data) {
            return !!data.name;
        }
    };
};
