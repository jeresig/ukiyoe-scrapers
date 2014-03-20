// http://www.cmoa.org/CollectionDetail.aspx?item=1027993

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://embarkkiosk.chazen.wisc.edu/OBJ1097?sid=1234&x=194&port=1597",
                next: "//a[contains(text(),'NEXT')]",
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