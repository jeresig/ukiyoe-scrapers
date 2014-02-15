module.exports = function(site) {
    var correctDate = function(data) {
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
                    "name[]": '//span[@class="collectionBiographicName"]',

                    dates: ['//span[@class="collectionBiographicName"]/following-sibling::text()', function(dates, data) {
                        if (!/Japanese/i.test(dates) || !/printmaker/i.test(dates)) {
                            return false;
                        }

                        var origDate = dates = dates
                            .replace(/\n/g, " ").replace(/^\(|\)$/g, "")
                            .replace(/.*Japanese(;\s*)?/, "").split(/;\s*/);

                        // TODO: Keep artists that are Japanese printmakers, but have no date info

                        if (/Male|Female/i.test(dates[0])) {
                            data.gender = dates.shift();
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
                            if (/((?:ca?.\s*)?)(\d{4})(s?)(?:\s*-\s*((?:ca?.\s*)?)(\d{4})(s?))?/.test(dates[0])) {
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

                        if (data.activeStart || data.activeEnd) {
                            data.active = {
                                original: origDate,
                                start: data.activeStart,
                                start_ca: data.activeStart_ca,
                                end: data.activeEnd,
                                end_ca: data.activeEnd_ca,
                                current: data.alive
                            };
                        }

                        if (data.birth || data.death) {
                            data.life = {
                                original: origDate,
                                start: data.birth,
                                start_ca: data.birth_ca,
                                end: data.death,
                                end_ca: data.death_ca,
                                current: data.alive
                            };
                        }

                        return true;
                    }],

                    bio: '//h3[contains(text(),"Biography")]/following-sibling::p[1]',

                    aliases: ['//h3[contains(text(),"Also Known As")]/following-sibling::p[1]', function(aliases, data) {
                        return aliases.replace(/\n/g, " ").split(/;\s*/).map(function(name) {
                            return name.replace(/ \(.*?\)/, "").split(/,\s*/).reverse().join(" ");
                        }).filter(function(name) {
                            return name !== data.name;
                        });
                    }],

                    url: function(data) {
                        if (!data.url && data.savedPage) {
                            if (/(\d+).html/.test(data.savedPage)) {
                                return "http://www.britishmuseum.org/research/search_the_collection_database/term_details.aspx?bioId=" + RegExp.$1;
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept: function(data) {
            var hasDate = data.dates;
            delete data.dates;
            if (data.aliases && data.aliases.length === 0) {
                delete data.aliases;
            }
            return !!data.name && !!hasDate;
        }
    };
};
