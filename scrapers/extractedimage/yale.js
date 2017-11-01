module.exports = function(options, casper) {
    return {
        scrape: [
            {
                start: "http://artgallery.yale.edu/collection/search?field_object_department_tid=All&title=&field_geography_value=&field_classification_value=All&field_medium_value=woodblock&field_object_number_value=&title_1=&field_culture_value=Japanese&field_object_location_value=All&sort_by=title",
                next: "//a[contains(.//text(),'next')]",
                visit: "//h2/a"
            },
            {
                extract: {
                    title: "//title",
                    dateCreated: "//div[contains(@class,'field-name-field-dated')]",
                    artists: ["//div[contains(@class,'field-name-object-artists')]", function(name) {
                        return name.replace(/Artist:\s*/, "")
                            .replace(/, Japanese.*$/, "");
                    }],
                    dimensions: "//div[contains(@class,'field-name-field-dimensions')]",
                    "images[]": "//a[@class='download'][contains(text(),'presentation')]/@href",
                    "_ids[]": function(data) {
                        if (data.images) {
                            return data.images.map(function(val) {
                                // Ugh - two different URL schemes!
                                if (/objectid=(\d+)/.exec(val) ||
                                    /content\/id\/([^\/]+)/.exec(val)) {
                                    return RegExp.$1;
                                }
                            });
                        }
                    }
                }
            }
        ]
    };
};