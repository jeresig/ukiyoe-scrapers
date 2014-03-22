// http://www.brooklynmuseum.org/opencollection/objects/3193/Kaiyoikomachi%3A_A_Geisha_in_her_Lovers_Room_from_Futaba_gusa_Nanakomachi/set/27ad8fc63c710762fa98985a21528f7b

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://www.brooklynmuseum.org/opencollection/search/?collection_id=2&title=&portfolio=&description=&accession_number=&medium=woodblock&object_year_begin=&object_year_end=&period=&dynasty=&tag=&x=34&y=10&type=object",
                next: "//a[img[@class='right']]",
                visit: "//a[img[contains(@src,'cdn')]]"
            },
            {
                extract: {
                    title: "//p[contains(@class,'object-title')]",
                    dateCreated: "//li[contains(text(),'Dates:')]/span",
                    artists: ["//li[contains(text(),'Artist:')]/a", function(val) {
                        return val.replace(/,[\s\S]*$/, "");
                    }],
                    dimensions: "//li[contains(text(),'Dimensions:')]/span",
                    description: ["//li[contains(text(),'Catalogue Description:')]/span", function(val) {
                        return val.replace("read more...", "");
                    }],
                    "images[]": ["//img[@id='main-image']/@src", function(val, data) {
                        data._ids = [/([^\/]+).jpg$/.exec(val)[1]];
                        return val.replace(/size2/, "size4");
                    }]
                }
            }
        ]
    };
};