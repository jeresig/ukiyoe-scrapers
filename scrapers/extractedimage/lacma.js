// http://collections.lacma.org/node/189388
// http://collections.lacma.org/node/188951 (no high res)

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://collections.lacma.org/search/site/?f[0]=bm_field_has_image%3Atrue&f[1]=im_field_classification%3A25&f[2]=im_field_curatorial_area%3A46",
            visit: "//div[@class='search-result-image']/a",
            next: "//a[contains(text(),'next')]"
        },
        {
            extract: {
                title: "//div[@property='dc:title']",
                dateCreated: "//div[@class='group-right']/text()",
                artists: "//div[contains(@class,'artist-name')]",
                dimensions: "//div[@class='field'][contains(text(),'Image:')]",
                "images[]": "//a[contains(@href,'download')]/@href || //div[@class='media-asset-image']/img/@src",
                // Need to duplicate, to get correct image ID
                "_ids[]": ["//div[@class='media-asset-image']/img/@src", val => /([^\/]+).jpg/.exec(val)[1]]
            }
        }
    ]
});