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
                    name: "//div[@id='mw-content-text']//p[b][1]/b[1]",

                    kanji: ["//*[@class='interwiki-ja']/a/@title || //*[@class='t_nihongo_kanji'][1]", (kanji, data) => {
                        data.name += " " + kanji;
                    }],

                    bio: ["//div[@id='mw-content-text']/p", (bio, origData) => {
                        var data = {};
                        var dates = bio;
                        var origDate = dates;

                        if (/\d{4}–\d{4}/.test(dates)) {
                            // PASS
                        } else if (/active in the (\d{4})s/.test(dates)) {
                            var num = RegExp.$1 - 0;
                            dates = num + " - " + (num + 9);
                        } else if (/active\D+(\d{4}) to (\d{4})/.test(dates)) {
                            dates = RegExp.$1 + " - " + RegExp.$2;
                        } else if (/(\d{4})-(\d{2})s/.test(dates)) {
                            dates = RegExp.$1 + " - " +
                                RegExp.$1.slice(0, 2) +
                                (RegExp.$2 - 0 + 9);
                        }

                        if (/(\d{4})[\s\S]*?(\d{4})/.test(dates)) {
                            var start = RegExp.$1 - 0;
                            var end = RegExp.$2 - 0;
                            if (end - start <= 30) {
                                data.activeStart = start;
                                data.activeEnd = end;
                            } else {
                                data.birth = RegExp.$1;
                                data.death = RegExp.$2;
                            }
                        }

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

                        origData.locations = [];

                        if (/Osaka/.test(bio)) {
                            origData.locations.push("Osaka");
                        }
                        if (/Kyoto/.test(bio)) {
                            origData.locations.push("Kyoto");
                        }
                        if (/Edo/.test(bio)) {
                            origData.locations.push("Edo");
                        }

                        return bio.replace(/\[\d+\]/g, "")
                            .replace(/\?\)/g, ")");
                    }],

                    url(data) {
                        if (!data.url && data.savedPage) {
                            if (/([^\/]+).html/.test(data.savedPage)) {
                                data._id = RegExp.$1;
                                return "http://en.wikipedia.org/wiki/" + RegExp.$1;
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
