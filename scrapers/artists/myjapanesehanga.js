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
                    name: ["//span[@id='sites-page-title']", function(name, data) {
                        name = name.replace(/\n/g, " ");

                        if (/Unread|Unknown/i.test(name)) {
                            return;
                        }

                        if (/\s*\((.*?)\)/.test(name)) {
                            var last = RegExp.$1
                                .replace(/\n/g, " ")
                                .replace(/^\(|\)$/g, "");
                            var origDate = last;

                            name = name.replace(/\s*\((.*?)\)/, "");

                            data.active = false;

                            if (/floruit|fl\.|active/.test(last)) {
                                data.active = true;

                                if (/ca?\.|\?/.test(last)) {
                                    data.activeStart_ca = true;
                                    data.activeEnd_ca = true;
                                }
                            }

                            if (/((?:ca?.\s*)?)(\d{4})(s?)(?:\s*-\s*((?:ca?.\s*)?)(\d{4})(s?))?/.test(last)) {
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
                        }

                        return name;
                    }],

                    bio: ["//div[contains(@class, 'sites-tile-name-content-1')]", function(bio, data) {
                        site.romajiName.extractKanji(bio, data);

                        return bio;
                    }],

                    url: function(data) {
                        if (!data.url && data.savedPage) {
                            if (/([^\/]+).html/.test(data.savedPage)) {
                                return "http://www.myjapanesehanga.com/home/artists/" + RegExp.$1;
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept: function(data) {
            return !!data.name;
        }
    };
};
