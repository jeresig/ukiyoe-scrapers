// http://www.hum2.pref.yamaguchi.lg.jp/sk2/sku/sku2.aspx

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://www.hum2.pref.yamaguchi.lg.jp/sk2/sku/sku.aspx",
            next: "(//td/span)[last()]/parent::td/following-sibling::td[a][1]",
            visit: "//a[contains(.,'詳細')]"
        },
        {
            extract: {
                title: "//text()[contains(.,'作品名:')]/following-sibling::input/@value",
                title_en: ["//text()[contains(.,'英語名:')]/following-sibling::input/@value", (val, data) => {
                    data.title += " (" + val + ")";
                }],
                dateCreated: "//text()[contains(.,'西暦:')]/following-sibling::input/@value",
                series: ["//p[@class='auctitle']//text()[contains(.,'Series;')]", val => val.replace(/Series;\s*/, "")],
                artists: "//text()[contains(.,'作者名:')]/following-sibling::input/@value",
                "publishers[]": "//text()[contains(.,'版元:')]/following-sibling::input/@value",
                dimensionsWidth: "(//text()[contains(.,'天:')]/following-sibling::input/@value)[1]",
                dimensionsHeight: "(//text()[contains(.,'左:')]/following-sibling::input/@value)[1]",
                dimensions(data) {
                    return data.dimensionsWidth + "cm x " + data.dimensionsHeight + "cm";
                },
                description: "//td[contains(.,'作品解説')]/following-sibling::td/textarea",
                "images[]": ["//input[@type='image'][contains(@src,'U')]/@src", val => val.replace(/m.jpg/, ".jpg")],
                "_ids[]": function(data) {
                    if (data.images) {
                        return data.images.map(val => /([^\/]+).jpg$/.exec(val)[1]);
                    }
                }
            }
        }
    ]
});