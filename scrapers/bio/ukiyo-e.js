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
        encoding: "iso-8859-1",
        scrape: [
            {
                extract: {
                    name: ["//p[@class='title'][contains(text(), 'Biography ')]", (name, origData) => {
                        var data = {};
                        /Biography (.*?) \((.*?)\)$/.test(name);
                        name = RegExp.$1;
                        var dates = RegExp.$2;
                        var origDate = dates;
                        var parts = dates.split(/\s*-\s*/);
                        var start = parts[0];
                        var end = parts[1];

                        var circa = /circa|ca\.?|c\.?|\?/g;

                        if (circa.test(start)) {
                            data.start_ca = true;
                            start = start.replace(circa, "")
                                .replace(/\s*/g, "");
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
                            data.alive = !data.end_ca;
                        }

                        correctDate(data);

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

                        return name;
                    }],

                    bio: ["//p[@class='title'][contains(text(), 'Biography ')]/following-sibling::p", (bio, data) => {
                        bio = bio.split(/\n\n\n/)[0].replace(/\n/g, " ");
                        return bio !== "Biography unavailable." ?
                            bio : null;
                    }],

                    url(data) {
                        if (!data.url && data.savedPage) {
                            if (/(\d+).html/.test(data.savedPage)) {
                                data._id = RegExp.$1;
                                return "http://www.ukiyo-e.com/ukiyo-e-biographies.php?page=artist&ID=" + RegExp.$1;
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
