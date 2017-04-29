// http://www.fujiarts.com/cgi-bin/item.pl?item=379124

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://www.fujiarts.com/cgi-bin/search.pl?action=search&querytype=1&desc=true&query=&match=Or&artist=&category=&types=&itemstatus=all&sort=newest&bidmin=&bidmax=&binmin=&binmax=&pb=25&x=78&y=2",
            next: "//a[contains(.//text(),'Next')]",
            visit: "//a[b]"
        },
        {
            extract: {
                title: ["//td[@class='auctionTitle']/b[1]", (val, data) => {
                    if (/(\d{4}.*$)/.test(val)) {
                        data.dateCreated = RegExp.$1;
                    }
                    return val;
                }],
                series: ["//p[@class='auctitle']//text()[contains(.,'Series;')]", val => val.replace(/Series;\s*/, "")],
                artists: "//td[@class='auctionTitle']/b[2]",
                dimensions: ["//b[contains(text(),'Image Size')]/following-sibling::text()[1]", val => val.replace(/^\s*-\s*/, "")],
                description: ["//b[contains(text(),'Comments')]/following-sibling::text()[1]", val => val.replace(/^\s*-\s*/, "")],
                price: "//td[contains(text(),'Current High Bid')]/following-sibling::td/span || //span[@class='titleSmaller']",
                sold: ["//b[contains(text(),'Item Closed')]", () => true],
                "images[]": "//img[contains(@src,'japanese-prints')]/@src",
                "_ids[]": function(data) {
                    if (data.images) {
                        return data.images.map(val => /([^\/]+).jpg$/.exec(val)[1]);
                    }
                }
            }
        }
    ]
});