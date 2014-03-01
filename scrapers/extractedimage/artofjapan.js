var sprintf = require("util").format;

var column = "//td[contains(.//text(),'%s')]/following-sibling::td[2]/span/text()[1]";

// http://www.theartofjapan.com/ArtDetail.asp?Inv=rd0110024

module.exports = function() {
    return {
        scrape: [
            {
                start: "http://www.theartofjapan.com/ArtSearch.asp",
                visit: "//a[contains(@href,'ArtDetail')][img]",
                next: "//a[contains(@href,'ArtSearch')][contains(text(),'Next')]"
            },
            {
                extract: {
                    _id: sprintf(column, "Inventory Number"),
                    title: sprintf(column, "Title"),
                    series: sprintf(column, "Series"),
                    description: sprintf(column, "Notes"),
                    dateCreated: sprintf(column, "Date Of Work"),
                    artists: sprintf(column, "Artist"),
                    publishers: sprintf(column, "Publisher"),
                    dimensions: sprintf(column, "Dimensions"),
                    condition: sprintf(column, "Condition"),
                    price: sprintf(column, "Price"),
                    sold: ["//font[contains(text(),'SOLD')]", function() {
                        return true
                    }],
                    url: function(data) {
                        // Generate a clean URL
                        return "http://www.theartofjapan.com/ArtDetail.asp?Inv=" + data._id;
                    },
                    images: function(data) {
                        return ["http://www.theartofjapan.com/Art_Images/Large/" + data._id + ".jpg"];
                    }
                }
            }
        ]
    };
};