exports.extract = {
	artist: "//td[contains(text(), '作者:')]/following-sibling::td[1]",
	date: "//td[contains(text(), '時代:')]/following-sibling::td[1]",
	source_image: "//img[contains(@src, '1024')]/@src"
};

exports.genURL = function( id ) {
	return "http://webarchives.tnm.jp/imgsearch/show/" + id;
};
