exports.searchURL = 'http://www.dh-jac.net/db/arcnishikie/FMPro?-db=nishikie.fmj&-format=resultsp.htm&-lay=layout2&-sortfield=-None-&-sortfield=-none-&-sortfield=-none-&f00=%3d%22%8c%f6%8a%4a%22&f00=%3d%22%8c%f6%8a%4a%22&f49=%8d%91%89%ef%90%7d%8f%91%8a%d9&f11=1&f11=1&-max=100&-find=';

exports.extractSearch = {
	urls: "//a[contains(@href,'results-bigp')]/@alt",
	nextURL: "//a[contains(text(),'次ページ')]/@href"
};

exports.extract = {
	source_id: "//font[contains(text(), 'AcNo.')]/following-sibling::text()[1]",
	title: "//font[contains(text(), '画題等:')]/following-sibling::a[1]",
	artist: "//font[contains(text(), '絵師:')]/following-sibling::a[1]",
	date: [ "//font[contains(text(), '出版年月日:')]/following-sibling::text()[1]", function( date ) {
		return date.replace( /^\D*|\D*$/g, "" );
	} ],
	description: [ "//td[contains(font/text(), '画題等:')]", function( text ) {
		return text.replace( /画題等:/, "" );
	} ],
	source_image: "//img[contains(@src, 'jpg')]/@src"
};

exports.genURL = function( id ) {
	return "http://www.dh-jac.net/db/arcnishikie/FMPro?-db=nishikie.fmj&-lay=layout2&f00=%3d%22%8c%f6%8a%4a%22&f1=" + id + "&f00=%3d%22%8c%f6%8a%4a%22&f11=1&f11=1&-max=100&-Format=results-bigp.htm&-max=1&-Find";
};
