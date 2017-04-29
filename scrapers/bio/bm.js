module.exports = site => {
    var correctDate = data => {
        if (data.active) {
            data.activeStart = (data.start - 0) || null;
            data.activeEnd = (data.end - 0) || null;

            if (data.startCirca && data.start) {
                data.activeStart_ca = true;
            }

            if (data.endCirca && data.end) {
                data.activeEnd_ca = true;
            }

        } else {
            data.birth = (data.start - 0) || null;
            data.death = (data.end - 0) || null;

            if (data.startCirca && data.start) {
                data.birth_ca = true;
            }

            if (data.endCirca && data.end) {
                data.death_ca = true;
            }
        }
    };

    return {
        scrape: [
            {
                extract: {
                    "name": '//span[@class="collectionBiographicName"]',

                    dates: ['//span[@class="collectionBiographicName"]/following-sibling::text()', (dates, ret) => {
                        if (!/Japanese/i.test(dates) || !/printmaker/i.test(dates)) {
                            return false;
                        }

                        var data = {};
                        var origDate = dates = dates
                            .replace(/\n/g, " ").replace(/^\(|\)$/g, "")
                            .replace(/.*Japanese(;\s*)?/, "");

                        dates = dates.split(/;\s*/);

                        // TODO: Keep artists that are Japanese printmakers, but have no date info

                        if (/Male|Female/i.test(dates[0])) {
                            ret.gender = dates.shift();
                        }

                        var last = dates[dates.length - 1];
                        data.active = false;

                        if (/floruit|fl\.|active/.test(last)) {
                            data.active = true;

                            if (/ca?\.|\?/.test(last)) {
                                data.activeStart_ca = true;
                                data.activeEnd_ca = true;
                            }

                            dates.pop();
                        }

                        //if (dates.length === 2 || dates.length === 4) {
                            last = dates[dates.length - 1];

                            if (!/\d/.test(last)) {
                                if (/ca?\.|\?/.test(last)) {
                                    data.birth_ca = true;
                                    data.death_ca = true;
                                }
                                dates.pop();
                            }
                        //}

                        // Format: born; active; died
                        if (dates.length === 1) {
                            if (/^\d+$/.test(dates[0]) && !data.active) {
                                data.death = dates[0] - 0;
                            } else if (/((?:ca?.\s*)?)(\d{4})(s?)(?:\s*-\s*((?:ca?.\s*)?)(\d{4})(s?))?/.test(dates[0])) {
                                data.start = RegExp.$2;

                                if (RegExp.$1 || RegExp.$3) {
                                    data.startCirca = true;
                                }

                                data.end = RegExp.$5;

                                if (!data.end) {
                                    if (!data.active) {
                                        data.end = "";
                                        if (data.start >= 1913) {
                                            data.alive = true;
                                        }

                                    } else if (RegExp.$3) {
                                        data.end = (data.start - 0) + 9;
                                        data.endCirca = true;

                                    } else {
                                        data.end = data.start;
                                        data.endCirca = data.startCirca;
                                    }

                                } else {
                                    if (RegExp.$4) {
                                        data.endCirca = true;
                                    }

                                    if (RegExp.$6) {
                                        data.end = (data.end - 0) + 9;
                                        data.endCirca = true;
                                    }
                                }

                                correctDate(data);

                                dates.shift();
                            }
                        } else if (dates.length >= 3) {
                            if (/(\d{4})/.test(dates[0])) {
                                data.birth = RegExp.$1 - 0;
                            }

                            var range = dates.length > 3 ?
                                dates[4] : dates[1];

                            if (/(\d{4})\s*-\s*(\d{4})/.test(range)) {
                                data.activeStart = RegExp.$1 - 0;
                                data.death = RegExp.$2 - 0;
                            }

                            var end = dates.length > 3 ?
                                dates[3] : dates[2];

                            if (/(\d{4})/.test(end)) {
                                data.activeEnd = RegExp.$1 - 0;
                            }
                        }

                        if (data.activeEnd && data.activeStart && data.death &&
                            data.activeEnd < data.activeStart) {
                                data.activeEnd = data.death;
                                data.activeEndCirca = data.death_ca;
                        }

                        delete data.active;

                        if (data.activeStart || data.activeEnd) {
                            ret.active = {
                                original: origDate,
                                start: data.activeStart,
                                start_ca: data.activeStart_ca,
                                end: data.activeEnd,
                                end_ca: data.activeEnd_ca,
                                current: data.alive
                            };

                            for (var prop in data.active) {
                                if (data.active[prop] == null) {
                                    delete data.active[prop];
                                }
                            }
                        }

                        if (data.birth || data.death) {
                            ret.life = {
                                original: origDate,
                                start: data.birth,
                                start_ca: data.birth_ca,
                                end: data.death,
                                end_ca: data.death_ca,
                                current: data.alive
                            };

                            for (var prop in data.life) {
                                if (data.life[prop] == null) {
                                    delete data.life[prop];
                                }
                            }
                        }

                        return true;
                    }],

                    bio: '//h3[contains(text(),"Biography")]/following-sibling::p[1]',

                    aliases: ['//h3[contains(text(),"Also Known As")]/following-sibling::p[1]', (aliases, data) => {
                        var names = aliases.replace(/\n/g, " ").split(/;\s*/).map(name => name.replace(/ \(.*?\)/, "").split(/,\s*/).reverse().join(" ")).filter(name => name && name !== data.name);

                        // Merge in standalone kanji names
                        for (var i = aliases.length - 1; i > 0; i--) {
                            if (!/[a-z]/i.test(aliases[i])) {
                                aliases[i - 1] += " " + aliases[i];
                                aliases[i] = "";
                            }
                        }

                        return aliases.filter(name => !!name.trim());
                    }],

                    url(data) {
                        if (!data.url && data.savedPage) {
                            if (/(\d+).html/.test(data.savedPage)) {
                                data._id = RegExp.$1;
                                return "http://www.britishmuseum.org/research/search_the_collection_database/term_details.aspx?bioId=" + RegExp.$1;
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept(data) {
            var hasDate = data.dates;
            delete data.dates;
            if (data.aliases && data.aliases.length === 0) {
                delete data.aliases;
            }
            return !!data.name && !!hasDate;
        }
    };
};
