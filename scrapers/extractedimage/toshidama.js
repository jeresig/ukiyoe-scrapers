// http://www.toshidama-japanese-prints.com/item_684/print.htm
// http://www.toshidama-japanese-prints.com/main-images/Hiroshige_II_48_Views_Edo_Shiba_Shinmei_Shrine.jpg
// http://www.toshidama-japanese-prints.com/item_684/Hiroshige-II-48-Views-of-Edo-14--Shiba-Shinmei-Shrine.htm

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://www.toshidama-japanese-prints.com/catalog.php?keyword=&cond=advand&category=",
                visit: "//a[@class='itemcolor']",
                next: "//a[contains(@title,'Next')]"
            },
            {
                extract: {
                    title: "//strong//em",
                    description: "//p/*[not(self::strong or self::a)]",
                    dateCreated: ["//strong/span/text()[2]", function(val) {
                        var m = /(\d{4})/.exec(val);
                        return m ? m[0] : "";
                    }],
                    artists: "//strong/span/text()[1]",
                    price: ["//tr[td[@class='accent']][1]", function(val, data) {
                        if (/sold/i.test(val)) {
                            data.sold = true;
                            return "";
                        }

                        return val.replace(/price:\s*/i, "");
                    }],
                    "images[]": "//img[@class='largeimage1']/@src",
                    _id: function(data) {
                        if (data.images && /([^\/]+).jpg/.test(data.images[0])) {
                            return RegExp.$1;
                        }
                    }
                }
            }
        ]
    };
};