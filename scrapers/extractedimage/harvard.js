exports.extract = {
	title: '//div[contains(@class, "ham-object-title")]//div[1]',
	artist: '//div[contains(@class, "ham-object-constituent")]//a',
	date: '//div[contains(@class, "ham-object-period")]',
	source_image: [ '//img[contains(@class,"cur_img")]/@src', img => img.replace(/=\d+/g, "=2000") ]
};

exports.getImage = url => /urn-3:(.*?)_dynmc/.test( url ) ?
    RegExp.$1.replace(/:/g, "-") + ".jpg" :
    "";

exports.genURL = id => "http://www.harvardartmuseums.org/art/" + id;
