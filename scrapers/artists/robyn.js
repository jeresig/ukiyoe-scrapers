module.exports = function(site) {
    var correctDate = function(data) {
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
                    name: ["//font[@size='5'][1]", function(name, data) {
                        return name
                            .replace(/\s*\|.*$/, "")
                            .replace(/\([^\)]+\)/g, "");
                    }],

                    dates: ["//font[@size='5']/following-sibling::font[@size='2']", function(dates, data) {
                        var origDate = dates;
                        var parts = dates.replace(/\(\s*|\s*\)/g, "").split(/\s*-\s*/);
                        var start = parts[0];
                        var end = parts[1];

                        var circa = /circa|ca\.?|c\.?|\?/g;

                        if (circa.test(start)) {
                            data.start_ca = true;
                            start = start.replace(circa, "").replace(/\s*/g, "");
                        }

                        circa = /circa|ca\.?|c\.?|\?/g;

                        if (circa.test(end)) {
                            data.end_ca = true;
                            end = end.replace(circa, "").replace(/\s*/g, "");
                        }

                        if (/(\d{4})/.test(start)) {
                            data.start = RegExp.$1;
                        }

                        if (/(\d{4})/.test(end)) {
                            data.end = RegExp.$1;

                        } else if (data.start && (!end || !/\S/.test(end))) {
                            data.alive = true;
                        }

                        correctDate(data);

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

                        return null;
                    }],

                    bio: ["//td/font[@size='2'][count(preceding-sibling::*)=0]", function(bio, data) {
                        bio = bio.replace(/\n/g, " ");
                        return bio;
                    }],

                    url: function(data) {
                        if (!data.url && data.savedPage) {
                            if (/(\d+).html/.test(data.savedPage)) {
                                return "http://www.robinbuntin.com/artists/artist.aspx?ArtistID=" + RegExp.$1;
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept: function(data) {
            return !!data.name &&
                !/Artwork Available/i.test(data.name);
        }
    };
};
