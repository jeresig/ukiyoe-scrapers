// http://www.ccma-net.jp/search/index.php?app=shiryo&mode=detail&list_id=81014&data_id=3627
// http://www.ccma-net.jp/search/index.php?app=shiryo&mode=detail&list_id=81014&data_id=4776

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://www.ccma-net.jp/search/index.php?app=shiryo&mode=detail&list_id=81014&data_id=4776",
                next: "//a[img[contains(@src,'next')]]",
                extract: {
                    title: "(//span[@class='tmediumbold'])[2]",
                    dateCreated: ["//div[@class='pyear']//text()[contains(.,'制作年：')]", function(val) {
                        return val.replace(/制作年：/, "");
                    }],
                    artists: "(//span[@class='tmediumbold'])[1]",
                    artists_en: ["(//span[@class='tsmall'])[2]", function(val, data) {
                        data.artists += " " + val;
                    }],
                    dimensions: ["//div[@class='pyear']//text()[contains(.,'寸　法：')]", function(val) {
                        return val.replace(/寸　法：/, "");
                    }],
                    description: "//div[@class='pyear']/following-sibling::div/p",
                    "images[]": ["//img[@name='pict']/@src", function(val) {
                        return val.replace(/mid/, "large");
                    }],
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