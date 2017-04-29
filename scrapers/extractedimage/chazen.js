// http://embarkkiosk.chazen.wisc.edu/OBJ1097?sid=1234&x=194&port=1597

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://embarkkiosk.chazen.wisc.edu/OBJ1097?sid=1234&x=194&port=1597",
            next: "//a[contains(text(),'NEXT')]",
            extract: {
                title: "//h2",
                dateCreated: "//div[@id='objectDetailCell']/b/following-sibling::text()[1]",
                artists: "//a[contains(@href,'Art')]",
                dimensions: "//div[@id='objectDetailCell']/text()[contains(.,'mm')]",
                "images[]": ["//img[contains(@src,'Previews')]/@src", (val, data) => {
                    var val = val.replace(/Previews/, "images")
                        .replace(/JPRINTS\/[^\/]+\/(\d+)-(.*.jpg)/,
                        "Print_Room/processed/web_size/2010_08/19$1_$2");
                    data._ids = [/([^\/]+).jpg$/.exec(val)[1]];
                    return val;
                }],
                url(data) {
                    return data.url.replace(/\?.*$/, "");
                }
            }
        }
    ]
});