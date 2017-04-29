// http://collections.si.edu/search/results.htm?q=woodblock&dsort=&date.slider=&fq=online_media_type%3A%22Images%22&fq=online_visual_material%3Atrue&fq=place%3A%22Japan%22&tag.cstype=all&view=list&start=0

module.exports = (options, casper) => ({
    scrape: [
        {
            start: "http://collections.si.edu/search/results.htm?q=woodblock&dsort=&date.slider=&fq=online_media_type%3A%22Images%22&fq=online_visual_material%3Atrue&fq=place%3A%22Japan%22&tag.cstype=all&view=list&start=0",
            next: "//a[contains(text(),'next')]",
            root: "//div[contains(@class,'record')]",
            extract: {
                title: ".//h2",
                dateCreated: ".//dd[@class='date-first']",
                artists: ".//dd[@class='name-first']",
                description: ".//dd[@class='notes-first']",
                dimensions: ".//dd[@class='physicalDescription-first']",
                "images[]": [".//img[contains(@src,'deliveryService')]/@src", (val, data) => val.replace(/max=\d+&/, "")],
                "_ids[]": [".//a[contains(@class,'thumbnail')]/@href", val => {
                    var id = /recordID=([^&]+)/.exec(val)[1];
                    var m = /ms=(\d+)/.exec(val);
                    return id + (m ? "-ms-" + m[1] : "");
                }],
                url: ".//a[contains(text(),'Record Link')]/@href"
            }
        }
    ]
});