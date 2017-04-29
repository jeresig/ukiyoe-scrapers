module.exports = site => {
    var correctDate = data => {
        if (data.active) {
            data.activeStart = (data.start - 0) || null;
            data.activeEnd = (data.end - 0) || null;

            if (data.start_ca && data.start) {
                data.activeStart_ca = true;
            }

            if (data.end_ca && data.end) {
                data.activeEnd_ca = true;
            }

        } else {
            data.birth = (data.start - 0) || null;
            data.death = (data.end - 0) || null;

            if (data.start_ca && data.start) {
                data.birth_ca = true;
            }

            if (data.end_ca && data.end) {
                data.death_ca = true;
            }
        }
    };

    return {
        scrape: [
            {
                extract: {
                    name: ["//tr[contains(./td/div/span,'Biography')]/following-sibling::tr[2]//span", (name, data) => {
                        data.locations = ["Osaka"];
                        return name;
                    }],

                    "aliases": ["//td[contains(./div/span,'Names:')]/following-sibling::td", (names, data) => {
                        var aliases = names.replace(/\n/g, " ")
                            .replace(/\(.*?\);/g, ";")
                            .split(/\s*(?:;|\band\b|\balso\b)\s*/)
                            .map(name => name
                            .replace(/ \[.*/, "")
                            .replace(/ \(.*/, "")
                            .replace(/[.*]/g, "").trim());

                        if (/\s*\((.*)\)/.test(data.name)) {
                            aliases.push(RegExp.$1);
                            data.name = data.name.replace(/\s*\((.*)\)/, "");
                        }

                        return aliases;
                    }],

                    dates: ["//td[contains(./div/span,'Dates:')]/following-sibling::td", (dates, origData) => {
                        var data = {};
                        var origDate = dates;

                        dates.split(/;\s*/).forEach(date => {
                            var parts = date.split(/\s*-\s*/);
                            var start = parts[0];
                            var end = parts[1];

                            if (/active/i.test(date)) {
                                data.active = true;
                            }

                            if (/circa|ca\.?|c\.?|\?/g.test(date)) {
                                data.start_ca = true;
                                data.end_ca = true;
                            }

                            if (/(\d{4})/.test(start)) {
                                data.start = RegExp.$1;
                            }

                            if (/(\d{4})(s?)/.test(end)) {
                                data.end = RegExp.$1 - 0;

                                if (RegExp.$2 === "s") {
                                    data.end += 9;
                                }

                            } else if (/(\d{2})/.test(end)) {
                                data.end = data.start.slice(0, 2) +
                                    RegExp.$1;

                            } else if (data.start && (!end || !/\S/.test(end))) {
                                data.alive = !data.end_ca;
                            }

                            correctDate(data);
                        });

                        if (data.activeStart || data.activeEnd) {
                            origData.active = {
                                original: origDate,
                                start: data.activeStart,
                                start_ca: data.activeStart_ca,
                                end: data.activeEnd,
                                end_ca: data.activeEnd_ca,
                                current: data.alive
                            };
                        }

                        if (data.birth || data.death) {
                            origData.life = {
                                original: origDate,
                                start: data.birth,
                                start_ca: data.birth_ca,
                                end: data.death,
                                end_ca: data.death_ca,
                                current: data.alive
                            };
                        }
                    }],

                    bio: "//p[contains(.,'Comments')]/following-sibling::p",

                    url(data) {
                        if (!data.url && data.savedPage) {
                            if (/([^\/]+).html/.test(data.savedPage)) {
                                data._id = RegExp.$1;
                                return "http://osakaprints.com/content/information/artist_bios/biographies/bio_" + RegExp.$1 + ".htm";
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept(data) {
            return !!data.name;
        }
    };
};
