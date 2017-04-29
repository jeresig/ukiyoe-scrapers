// http://www.metmuseum.org/Collections/search-the-collections/37112

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://www.metmuseum.org/collections/search-the-collections?where=Japan&ft=woodblock&ao=on&noqs=true&rpp=60&pg=%s",
            next: "(//a[img[contains(@title,'next')]])[1]",
            visit: '//div[@class="image-container"]//a[contains(@href,"search-the-collections")][img]'
        },
        {
            extract: {
                artists: "//dt[contains(.,'Who')]/following-sibling::dd[1]//li/a",
                title: "//div[@class='narrow-column']//h2",
                dateCreated: "//dt[contains(text(), 'Date')]/following-sibling::dd[1]",
                dimensions: "//dt[contains(text(), 'Dimensions')]/following-sibling::dd[1]",
                description: "//li[a[contains(.,'Description')]]//p",
                "images[]": ["//img[contains(@src,'web-additional')]/@src || //img[contains(@src,'web-large')]/@src", val => val.replace(/web-(?:additional|large)/, "original")],
                "_ids[]": function(data) {
                    if (data.images) {
                        return data.images.map(val => /([^\/]+).jpg$/.exec(val)[1]);
                    }
                },
                url(data) {
                    return data.url.replace(/\?.*$/, "");
                }
            }
        }
    ]
});