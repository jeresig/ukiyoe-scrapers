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
        nameOptions: {
            flipNonJa: true
        },

        scrape: [
            {
                root: "//tr[./td[@width='30%']]",
                extract: {
                    name: ["./td[@width='30%']", function(name, data) {
                        name = name.replace(/\n/g, " ")
                            .replace(/\s*\(.*/, "");

                        name = site.romajiName.flipName(name, /\s+/);

                        return name;
                    }],

                    dates: ["./td[@width='70%']", function(dates, origData) {
                        var data = {};
                        var origDate = dates = dates.replace(/\n/g, " ").replace(/^\(|\)$/g, "");
                        var last = dates;

                        data.active = false;

                        if (/floruit|fl\.|active/.test(last)) {
                            data.active = true;

                            if (/ca?\.|\?/.test(last)) {
                                data.activeStart_ca = true;
                                data.activeEnd_ca = true;
                            }
                        }

                        if (/((?:ca?.\s*)?)(\d{4})(s?)(?:\s*-\s*((?:ca?.\s*)?)(\d{4})(s?))?/.test(dates)) {
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
                        }

                        if (data.activeEnd && data.activeStart && data.death &&
                            data.activeEnd < data.activeStart) {
                                data.activeEnd = data.death;
                                data.activeEndCirca = data.death_ca;
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
                    }],

                    url: [".//a/@href", function(url) {
                        return "http://www.japanesegallery.co.uk/" + url;
                    }]
                }
            }
        ],

        accept: function(data) {
            return !!data.name;
        }
    };
};
