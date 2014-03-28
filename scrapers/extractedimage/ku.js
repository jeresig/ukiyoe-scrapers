// http://collection.spencerart.ku.edu/eMuseumPlus?service=ExternalInterface&module=collection&objectId=13149&viewType=detailView

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://collection.spencerart.ku.edu/eMuseumPlus?service=ExternalInterface&module=collection&moduleFunction=search",
                visit: function() {
                    casper.fillSelectors("#searchForm", {
                        "#field_10316": ["prints"],
                        "#field_10320": "japan"
                    }, true);
                }
            },
            {
                next: "//a[contains(@title,'Next')]",
                visit: "//li[@class='objectTitle']/a"
            },
            {
                visit: "//a[contains(@href,'window.open')]",
                extract: {
                    title: "//span[@class='tspTitleLink']",
                    series: "//li[@class='objectTitle']/following-sibling::li[1][not(contains(.,'woodcut'))]",
                    dateCreated: "//span[@class='dating']/span[@class='tspValue']",
                    artists: "//span[@class='tspReferenceLink']",
                    dimensions: ["//text()[contains(., 'Image Dimensions')][contains(.,'mm')]", function(val) {
                        val.replace("Image Dimensions Height/Width:", "");
                    }],
                    description: "//div[@class='caption']//span[@class='tspValue']",
                    url: "//a[contains(.,'bookmarkable')]"
                }
            },
            {
                extract: {
                    "images[]": "//img/@src",
                }
            }
        ]
    };
};