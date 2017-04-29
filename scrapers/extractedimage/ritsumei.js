exports.extract = {
	source_id: "//font[contains(text(), 'AcNo.')]/following-sibling::text()[1]",
	title: "//font[contains(text(), '画題等:')]/following-sibling::a[1]",
	artist: "//font[contains(text(), '絵師:')]/following-sibling::a[1]",
	date: [ "//font[contains(text(), '出版年月日:')]/following-sibling::text()[1]", date => date.replace( /^\D*|\D*$/g, "" ) ],
	description: [ "//td[contains(font/text(), '画題等:')]", text => text.replace( /画題等:/, "" ) ],
	source_image: "//img[contains(@src, 'jpg')]/@src"
};

exports.genURL = id => "http://www.dh-jac.net/db/arcnishikie/FMPro?-db=nishikie.FP5&-lay=layout2&f00=%3d%22%8c%f6%8a%4a%22&f1=" + id + "&f00=%3d%22%8c%f6%8a%4a%22&f11=1&f11=1&-max=100&-Format=results-bigp.htm&-max=1&-Find";
