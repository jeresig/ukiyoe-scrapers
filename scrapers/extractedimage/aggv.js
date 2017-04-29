exports.extract = {
	title: '//h1[contains(@class, "post-title")]',
	artist: ['//div[contains(@class, "field-field-artist")]',
		artist => artist.replace(/\b([Il]+)\b/g, a => a.replace(/l/g, "I"))],
	date: ['//div[contains(@class, "field-field-artwork-date")]',
		date => {
			date = date.replace(/Date: /, "");
			return date.indexOf("nd") >= 0 ? "" : date;
		}],
	description: '//div[contains(@class, "field-field-description")]',
	source_image: '//img[contains(@class, "imagecache")]/@src'
};

exports.genURL = id => "http://aggv.ca/artwork/" + id;
