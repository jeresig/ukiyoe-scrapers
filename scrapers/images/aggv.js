exports.extract = {
	title: '//h1[contains(@class, "post-title")]',
	artist: ['//div[contains(@class, "field-field-artist")]',
		function(artist) {
			return artist.replace(/\b([Il]+)\b/g, function(a) {
				return a.replace(/l/g, "I");
			});
		}],
	date: ['//div[contains(@class, "field-field-artwork-date")]',
		function(date) {
			date = date.replace(/Date: /, "");
			return date.indexOf("nd") >= 0 ? "" : date;
		}],
	description: '//div[contains(@class, "field-field-description")]',
	source_image: '//img[contains(@class, "imagecache")]/@src'
};

exports.genURL = function( id ) {
	return "http://aggv.ca/artwork/" + id;
};
