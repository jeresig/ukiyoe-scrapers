// http://rubens.cc.oberlin.edu/emuseum/view/objects/asitem/1433/1/title-asc

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://rubens.cc.oberlin.edu/emuseum/view/objects/asitem/1433/1/title-asc",
            next: "//a[contains(text(),'Next')]",
            extract: {
                title: "//div[@id='singledata']//strong",
                dateCreated: "//div[strong]/following-sibling::div[not(span)][1]",
                artists: "//div[@class='related']//a[contains(@href,'people')]",
                dimensions: "//div[contains(text(),'Overall:')]",
                "images[]": ["//img[contains(@src,'preview')]/@src", (val, data) => {
                    data._ids = [/\d+/.exec(val)[0]];
                    return val.replace(/preview/, "full");
                }],
                url(data) {
                    return data.url.replace(/\?.*$/, "");
                }
            }
        }
    ]
});