exports.extract = {
	title: "//td[contains(b/text(), '画題等')]/following-sibling::td",
	artist: "//td[contains(b/text(), '絵師')]/following-sibling::td/a",
	date: [ "//td[contains(b/text(), '出版年月日')]/following-sibling::td/text()[1]", function( date ) {
		return date.replace( /.*\((.*?)\).*/, "$1" );
	} ],
	description: "//td[contains(b/text(), '分類')]/following-sibling::td",
	source_image: "//img[contains(@src, 'jpg')]/@src"
};

exports.genURL = function( id ) {
	return "http://metro.tokyo.opac.jp/tml/tpic/cgi-bin/detail.cgi?Kbseqid=" + id + "&Sryparam=001";
};
