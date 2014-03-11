// http://www.scholten-japanese-art.com/printsV.php?printID=430
// http://www.scholten-japanese-art.com/printsH.php?printID=589
// http://www.scholten-japanese-art.com/artistimages/10-2407.jpg

module.exports = function(options, casper) {
    return {
        scrape: [
            {
                // A bit of a hack! May not get all, but will get most!
                start: "http://www.scholten-japanese-art.com/search.php?searchby=all&criteria=i&searchin=all&includeSold=y",
                visit: "//a[contains(@href,'printID')][.//img]"
            },
            {
                extract: {
                    title: "//form//table[not(@width)]//tr[2]",
                    description: "//form//table[not(@width)]//tr[3]",
                    dateCreated: function(data) {
                        var m = /(\d{4})/.exec(data.description);
                        return m ? m[0] : "";
                    },
                    artists: "//span[@class='redtext']",
                    dimensions: "//form//table[not(@width)]//tr[4]",
                    price: ["//form//table[not(@width)]//span[contains(text(),'price:')]", function(val, data) {
                        if (/sold/i.test(val)) {
                            data.sold = true;
                            return "";
                        }

                        return val.replace(/price:\s+/i, "");
                    }],
                    images: ["//img[contains(@src,'artistimages')][not(contains(@src,'seal'))]/@src", function(val, data) {
                        if (/([^\/]+).jpg/.test(val)) {
                            data._id = RegExp.$1;
                            return ["http://www.scholten-japanese-art.com/artistimages/" + RegExp.$1 + ".jpg"];
                        }
                    }]
                }
            }
        ]
    };
};