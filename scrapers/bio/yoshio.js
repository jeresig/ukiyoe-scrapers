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

                        if (/([\u3041-\u3096\u30A0-\u30FF\s]+)\s/.test(val)) {
                            var kana = RegExp.$1;
                            var romaji = hepburn.fromKana(kana);

                            // It's written backwards!
                            romaji = romaji.trim().split(/\s+/)
                                .reverse().join(" ");

                            // Handle generations
                            var gen = {};
                            if (options.romajiName.extractGeneration(val, gen) && gen.generation) {
                                romaji += " " + gen.generation;
                            }

                            val = val.replace(kana, romaji + " ");
                        }

                        return val;
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
