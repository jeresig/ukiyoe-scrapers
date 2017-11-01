

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "https://www.rijksmuseum.nl/api/en/collection?key=fpGQTuED&format=xml&type=print&place=Japan&imgonly=True&ps=10&p=1",
                next: "//a[contains(text(),'NEXT')]",
                visit: function() {
                    
                }
            },
            {
                extract: {
                    title: "//h2",
                    dateCreated: "//div[@id='objectDetailCell']/b/following-sibling::text()[1]",
                    artists: "//a[contains(@href,'Art')]",
                    dimensions: "//div[@id='objectDetailCell']/text()[contains(.,'mm')]",
                    "images[]": ["//img[contains(@src,'Previews')]/@src", function(val, data) {
                        data._ids = [/([^\/]+).jpg$/.exec(val)[1]];
                        return val.replace(/Previews/, "images");
                    }],
                    url: function(data) {
                        return data.url.replace(/\?.*$/, "");
                    }
                }
            }
        ]
    };
};