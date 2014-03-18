// http://www.cmoa.org/CollectionDetail.aspx?item=1027993

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://www.cmoa.org/CollectionSearch.aspx?srch=woodcut&nationality=Japanese&WithImages=true",
                visit: "//a[@class='thumb-image-link']",
                next: "//a[contains(text(),'Next')]"
            },
            {
                extract: {
                    title: "#object-meta//h1",
                    dateCreated: "#object-meta//h2.sub2",
                    artists: "#object-meta//h2.sub1",
                    dimensions: "//div[@id='object-meta']//span[contains(.,'Measurements')]/following-sibling::span[1]",
                    "images[]": ["//img[contains(@src,'CollectionImage')]/@src", function(val, data) {
                        data._ids = [/\d+/.exec(val)[0]];
                        return val.replace(/Large/, "Full");
                    }],
                    url: function(data) {
                        return "http://www.cmoa.org/CollectionDetail.aspx?item=" +
                            /item=(\d+)/.exec(data.url)[1];
                    }
                }
            }
        ]
    };
};