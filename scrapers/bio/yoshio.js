var hepburn = require("hepburn");

module.exports = function(site) {
    return {
        files: "asahi/kato/yoshio/aiueo-zenesi/*/*.html",
        scrape: [
            {
                extract: {
                    name: ["(//td[@width='480']/font[@color='blue'])[1]", function(val, data) {
                        val = val.replace(/☆\s*/g, "");

                        if (/([\u3041-\u3096\u30A0-\u30FF\s]+)/.test(val)) {
                            var kana = RegExp.$1;
                            val = val.replace(kana, hepburn.fromKana(kana));
                        }

                        console.log(val)

                        return val;
                    }],

                    date: ["(//td[@width='480']/font[@color='blue'])[2]", function(val, data) {
                        console.log(val)
                        var match = /([０１２３４５６７８９0-9]{4}|[？?])[\s\S]*?～[\s\S]*?([０１２３４５６７８９0-9]{4}|[？?])/.exec(val);
                        if (match) {
                            console.log(match[1], match[2]);
                        }
                    }],

                    url: function(data) {
                        if (!data.url && data.savedFile) {
                            if (/([^\/]+).html/.test(data.savedFile)) {
                                data._id = RegExp.$1;
                                return "http://www.ne.jp/" + data.savedFile;
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept: function(data) {
            return false;
        }
    };
};
