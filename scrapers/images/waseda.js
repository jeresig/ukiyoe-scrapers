exports.extract = {
	title: "//b[contains(text(), '画題等')]/following-sibling::a",
	artist: "//b[contains(text(), '絵師:')]/following-sibling::a[1]",
	date: [ "//b[contains(text(), '上演年月日:')]/following-sibling::text()[1]", function( date ) {
		return date.replace( /.*\((.*?)\).*/, "$1" );
	} ],
	description: [ "//div[contains(b/text(), '組解説')]", function( text ) {
		return text.replace( /組解説:/g, "" ).replace( /個別解説:/g, "" );
	}],
	source_image: [ "//img[contains(@src, 'jpg')]/@src", function( url ) {
		return url.replace( /^%20/, "" );
	}]
};

exports.genURL = function( id ) {
	return "http://enpaku.waseda.ac.jp/db/enpakunishik/results-big.php?shiryo_no=" + id;
};
