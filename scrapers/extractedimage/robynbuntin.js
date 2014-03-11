module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://www.robynbuntin.com/Japanese-Prints-s/4012.htm",
                visit: "//a[.//img][contains(@href,'product-p')]",
                next: "(//input[contains(@src,'nextpage')])[1]"
            },
            {
                extract: {
                    title: ["//span[@itemprop='name']", function(val, data) {
                        var parts = val.split(/\s+by\s+/);

                        if (parts.length > 1) {
                            data.artists = [parts[1]];
                        }

                        return parts[0];
                    }],
                    description: "//*[@id='descript-text']",
                    dateCreated: "//*[@id='age-value']",
                    dimensions: "//*[@id='size-value']",
                    "images[]": ["//a[./img[contains(@class,'product_photo')]]/@href", function(val) {
                        return "http:" + val.replace(/\?.*$/, "");
                    }],
                    "_ids[]": function(data) {
                        if (data.images) {
                            return data.images.map(function(url) {
                                return /([^\/]+).jpg/.exec(url)[1];
                            });
                        }
                    }
                }
            }
        ]
    };
};