// http://www.floatingworld.com/scripts/auction_Detail.asp?mode=4&cs_wrk_InventoryID=X-025

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://www.floatingworld.com/scripts/auction_Results.asp",
            next: "//div[contains(@class,'header')]//a[contains(text(),'next')]",
            visit: "//a[img][contains(@href,'auction_Detail')]"
        },
        {
            extract: {
                title: "//th[contains(text(),'Title')]/following-sibling::td",
                series: "//th[contains(text(),'Series')]/following-sibling::td",
                dateCreated: "//th[contains(text(),'Date')]/following-sibling::td",
                artists: "//th[contains(text(),'Artist')]/following-sibling::td",
                dimensions: "//th[contains(text(),'Dimensions')]/following-sibling::td",
                description: "//th[contains(text(),'Comments')]/following-sibling::td",
                price: ["//th[contains(text(),'Selling Price')]/following-sibling::td", (val, data) => {
                    data.sold = true;
                    return val;
                }],
                "images[]": ["//img[contains(@src,'auction')]/@src", (val, data) => {
                    data._ids = [/([^\/]+)_l.jpg$/.exec(val)[1]];
                    return val;
                }]
            }
        }
    ]
});