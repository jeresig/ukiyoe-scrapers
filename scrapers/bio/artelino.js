module.exports = function(site) {
    var correctDate = done = function(data) {
        var origDate = data.dates;

        // Clean up text at the end of the line
        data.dates = data.dates.toLowerCase().replace(/(?:^| )([a-z, .:?'()-]+)$/i, "");

        // Remove "active" or "fl. ca."
        if (/^(?:active|fl.?)\s*/i.test(data.dates)) {
            data.dates = data.dates.replace(/^(?:active|fl.?)\s*/i, "");
            data.active = true;
        }

        // Remove "ca." and "around"
        if (/(ca\s*\.?|around)\s*/gi.test(data.dates)) {
            data.start_ca = true;
            data.end_ca = true;
            data.dates = data.dates.replace(/(ca\s*\.?|around)\s*/gi, "");
        }

        // Simplify 1st/2nd usage
        data.dates = data.dates.replace(/1st/g, "first").replace(/2nd/g, "second");

        // Remove extraneous details
        data.dates = data.dates.replace(/[.?']/g, "");
        data.dates = data.dates.replace(/(?:unknown|in\s*(?:the)?)/g, "");

        // Trim whitespace
        data.dates = data.dates.replace(/(^\s*|\s*$)/g, "");

        if (/^(?:(late|after) )?(\d{4})(s?)(\s*-?)$/i.test(data.dates)) {
            data.start = RegExp.$2 - 0;

            if (RegExp.$3) {
                data.end = data.start + 9;
                data.start_ca = true;
                data.end_ca = true;
            }

            if (RegExp.$1 === "after") {
                data.end = "";

            } else if (RegExp.$1 === "late") {
                data.start += 7;
            }

            if (data.active && !data.end) {
                data.end = data.start;
                data.end_ca = data.start_ca;
            }

            data.dates = data.dates.replace(/^(?:(late|after) )?(\d{4})(s?)$/i, "");
        }

        // Look for a born date
        if (/born (\d{4})(s?)/i.test(data.dates)) {
            data.start = RegExp.$1;

            if (RegExp.$2) {
                data.start_ca = true;
            }

            data.dates = data.dates.replace(/born (\d{4})s?/i, "");

            // If no death date is given, and born within the last 100 years,
            // artist may still be alive
            if (data.start - 0 >= 1913) {
                data.end = "";
                data.alive = true;
            }
        }

        // Look for a died date
        if (/died (\d{4})(s?)/i.test(data.dates)) {
            data.end = RegExp.$1;

            if (RegExp.$2) {
                data.end = (data.end - 0) + 9;
                data.end_ca = true;
            }

            data.dates = data.dates.replace(/died (\d{4})s?/i, "");
        }

        // first half XXth C/last half XXth C
        if (/(first|second) half (?:of )?(\d{2})/i.test(data.dates)) {
            var date = (RegExp.$2 - 1) * 100;

            if (RegExp.$1 === "first") {
                data.start = date;
                data.end = date + 50;

            } else {
                data.start = date + 50;
                data.end = date + 99;
            }

            data.start_ca = true;
            data.end_ca = true;
            data.dates = data.dates.replace(/(first|second) half (?:of )?(\d{2})/i, "");
        }

        // Look for XXth Century
        if (/^(?:(early|late|mid|mid-late) )?(\d{2})th\s*c?$/i.test(data.dates)) {
            var date = (RegExp.$2 - 1) * 100;

            data.start = date;
            data.end = date + 99;
            data.start_ca = true;
            data.end_ca = true;

            if (RegExp.$1 === "early") {
                data.end = data.start + 25;

            } else if (RegExp.$1 === "mid") {
                data.start += 40;
                data.end -= 40;

            } else if (RegExp.$1 === "mid-late") {
                data.start += 60;
                data.end -= 10;

            } else if (RegExp.$1 === "late") {
                data.start += 75;
            }

            data.dates = data.dates.replace(/^(?:(early|late|mid|mid-late) )?(\d{2})th\s*C?$/, "");
        }

        // Look for a XXXX-XXXX date range
        if (/(^|\d{4})(s?)\s*(?:[\/?-]| and )\s*(\d{4}|\d{2}|present|$)(s?)/.test(data.dates)) {
            data.start = RegExp.$1;
            data.end = RegExp.$3;

            // For XXXX-XXs
            if (data.end.length === 2) {
                data.end = data.start.slice(0, 2) + data.end;
            }

            // Artist is still alive
            if (data.end === "present") {
                data.alive = true;
            }

            // For start, when the date is 1820s, just leave as 1820
            if (RegExp.$2) {
                data.start_ca = true;
            }

            // For end, when the date is 1820s, convert to 1829
            if (RegExp.$4) {
                data.end = (data.end - 0) + 9;
                data.end_ca = true;
            }

            data.dates = "";
        }

        // If it's less than 30 years, it must be active
        if (data.end && data.start && (data.start - 0 + 20) > (data.end - 0)) {
            data.active = true;
        }

        if (data.end === "present" || !data.end) {
            data.end = "";
            data.alive = true;
        }

        if (data.start) {
            data.start -= 0;
        }

        if (data.end) {
            data.end -= 0;
        }

        if (data.active) {
            data.activeStart = data.start || null;
            data.activeEnd = data.end || null;

            if (data.start_ca && data.start) {
                data.activeStart_ca = true;
            }

            if (data.end_ca && data.end) {
                data.activeEnd_ca = true;
            }

        } else {
            data.birth = data.start || null;
            data.death = data.end || null;

            if (data.start_ca && data.start) {
                data.birth_ca = true;
            }

            if (data.end_ca && data.end) {
                data.death_ca = true;
            }
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
    };

    return {
        nameOptions: {
            givenFirst: true
        },

        scrape: [
            {
                extract: {
                    name: ['//h2[@class="caption2"]', function(name, data) {
                        return name.replace(/&nbsp;/g, " ")
                            .replace(/\n/g, " ").split(/\s*-\s*/)[0]
                            .replace(/\(.*?\)/, "");
                    }],

                    dates: ['//h2[@class="caption2"]', function(name) {
                        return name.replace(/&nbsp;/g, " ")
                            .replace(/\n/g, " ").split(/\s*-\s*/)
                            .slice(1).join("-");
                    }],

                    bio: '//div[@class="left-image"]/following-sibling::p[1][a]/text()',

                    url: function(data) {
                        if (!data.url && data.savedPage) {
                            if (/(\d+).html/.test(data.savedPage)) {
                                data._id = RegExp.$1;
                                return "http://www.artelino.com/forum/artists.asp?art=" + RegExp.$1;
                            }
                        }
                        return data.url;
                    }
                }
            }
        ],

        accept: function(data) {
            if (data.name && data.dates) {
                correctDate(data);
            }

            return !!data.name && !/Chin/i.test(data.bio) &&
                !/[xX]/.test(data.name);
        }
    };
};
