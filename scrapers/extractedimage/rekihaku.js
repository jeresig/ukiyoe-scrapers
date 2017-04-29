
module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://www.rekihaku.ac.jp/up-cgi/login.pl?p=param/nisikie/db_param",
            visit: "//input[@value='コレクション名一覧']"
        },
        {
            visit: "//a[contains(@href,'searchrd')]",
        },
        {
            next: "(//input[@value='次へ'])[1]",
            visit: "//a[contains(@href,'getdocrd')][not(img)]"
        },
        {
            extract: {
                title: "//td[contains(.//text(),'資料名称')]/following-sibling::td",
                title_en: ["//td[contains(.//text(),'Title')]/following-sibling::td", (val, data) => {
                    data.title += " (" + val + ")";
                }],
                dateCreated: "//td[contains(.//text(),'西暦1')]/following-sibling::td",
                artists: "//td[contains(.//text(),'画工名')]/following-sibling::td",
                artists_en: ["//td[contains(.//text(),'Designer')]/following-sibling::td", (val, data) => {
                    data.artists += " " + val;
                }],
                publishers: ["//td[contains(.//text(),'版元名')]/following-sibling::td", val => val.split("or")],
                publishers_en: ["//td[contains(.//text(),'Publisher')]/following-sibling::td", (val, data) => {
                    val.split(" or ").forEach((name, i) => {
                        data.publishers[i] += " " + name;
                    });
                }],
                depicted: ["//td[contains(.//text(),'人名')]/following-sibling::td", val => val.split(/、|　/)],
                dimensions: "//td[contains(.//text(),'法量')]/following-sibling::td",
                description: "//td[contains(.//text(),'その他固有件名')]/following-sibling::td",
                "images[]": ["//img[contains(@src,'shiryou')]/@src", val => val.replace(/shiryou/, "shosai")],
                "_ids[]": function(data) {
                    if (data.images) {
                        return data.images.map(val => /(\d+\/\d+).jpg$/.exec(val)[1].replace("/", "-"));
                    }
                }
            }
        }
    ]
});