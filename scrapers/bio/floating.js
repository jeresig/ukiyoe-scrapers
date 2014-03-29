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
                    name: ['//h2[@class="subtitle"]', function(name, data) {
                        var origName = name = name.replace(/\s*\|.*$/, "");

                        var parts = name.split(/\s*,\s*/);
                        var last = parts[parts.length - 1];

                        if (/\d/.test(last)) {
                            var origDate = last;

                            parts.pop();
                            data.active = false;

                            if (/floruit|fl\.|active/.test(last)) {
                                data.active = true;
                            }

                            if (/(\d{4})\s*-\s*(\d{2,4})/.test(last)) {
                                data.start = RegExp.$1;
                                data.end = RegExp.$2;

                                if (data.end.length === 2) {
                                    data.end = data.start.substr(0,2) + data.end;
                                }

                            } else if (/(\d{4})/.test(last)) {
                                data.start = RegExp.$1;

                                if (data.active) {
                                    data.end = RegExp.$1;
                                } else {
                                    data.alive = true;
                                }
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
                        }

                        name = parts.reverse().join(" ");

                        return name;
                    }],

                    bio: ['//div[@class="bio"]', function(bio, data) {
                        data.aliases = [];

                        bio = bio.replace(/\n/g, " ");

                        bio = bio.replace(/(?:N\.|F\.N\.|Studio name|Given name|Go:):?\s+([^.]+)\.\s*/g, function(all, aliases) {
                            aliases = aliases.replace(/\s*\(.*?\)/g, "");
                            data.aliases = data.aliases.concat(aliases.split(/,\s*/));
                            return "";
                        });

                        if (data.aliases.length === 0) {
                            delete data.aliases;

                        } else {
                            if (!/\s/.test(data.name)) {
                                var alias = data.aliases[0].split(/\s/);

                                if (alias.length > 1) {
                                    data.name = alias[0] + " " + data.name;
                                }
                            }

                            if (data.aliases[0] == data.name) {
                                data.aliases.shift();
                            }
                        }

                        return bio;
                    }],

                    url: function(data) {
                        if (!data.url && data.savedPage) {
                            if (/(\d+).html/.test(data.savedPage)) {
                                data._id = RegExp.$1;
                                return "http://www.floatingworld.com/scripts/ref_ArtistDetail.asp?art_ID=" + RegExp.$1;
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
