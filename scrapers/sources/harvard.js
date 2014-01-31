exports.extract = {
	title: '//div[contains(@class, "ham-object-title")]//div[1]',
	artist: '//div[contains(@class, "ham-object-constituent")]//a',
	date: '//div[contains(@class, "ham-object-period")]',
	source_image: [ '//img[contains(@class,"cur_img")]/@src', function( img ) {
		return img.replace(/=\d+/g, "=2000");
	} ]
};

exports.getImage = function( url ) {
	return /urn-3:(.*?)_dynmc/.test( url ) ?
		RegExp.$1.replace(/:/g, "-") + ".jpg" :
		"";
};

exports.genURL = function( id ) {
	return "http://www.harvardartmuseums.org/art/" + id;
};
