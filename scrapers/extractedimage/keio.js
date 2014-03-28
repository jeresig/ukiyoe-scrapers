// http://project.lib.keio.ac.jp/dg_kul/ukiyoe_artist_detail.php?id=26109
// http://project.lib.keio.ac.jp/dg_kul/ukiyoe_artist_detail.php?id=23601

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://project.lib.keio.ac.jp/dg_kul/ukiyoe_artist_tbl.php",
                visit: "//a[img][contains(@href,'title')]"
            },
            {
                visit: "//a[img][contains(@href,'detail')]"
            },
            {
                extract: {
                    title: ["//text()[contains(.,'画題 :')][1]", function(val) {
                        return val.replace(/画題 :/, "");
                    }],
                    title_en: ["//text()[contains(.,'英文画題 :')]", function(val, data) {
                        return data.title += " (" + val.replace(/英文画題 :/, "").trim() + ")";
                    }],
                    series: ["//th", function(val) {
                        return val.replace(/[\[\]]/g, "");
                    }],
                    dateCreated: ["//text()[contains(.,'制作年代 :')]", function(val) {
                        return val.replace(/制作年代 :/, "");
                    }],
                    artists: ["//text()[contains(.,'作者 :')]", function(val) {
                        return val.replace(/作者 :/, "");
                    }],
                    artists_en: ["//text()[contains(.,'作者英名 :')]", function(val, data) {
                        data.artists += " " + val.replace(/作者英名 :/, "");
                    }],
                    publishers: ["//text()[contains(.,'版元 :')]", function(val) {
                        return val.replace(/版元 :/, "");
                    }],
                    dimensions: ["//text()[contains(.,'寸法 :')]", function(val) {
                        return val.replace(/寸法 :/, "");
                    }],
                    "images[]": "//img[contains(@src,'gdata')]/@src",
                    "_ids[]": function(data) {
                        if (data.images) {
                            return data.images.map(function(val) {
                                return /([^\/]+).jpg$/.exec(val)[1];
                            });
                        }
                    }
                }
            }
        ]
    };
};