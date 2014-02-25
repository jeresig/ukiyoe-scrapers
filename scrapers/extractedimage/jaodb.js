exports.extract = {
	artist: ["//td[contains(font/text(), 'Artist:')]/following-sibling::td[1]",
		function(text) {
			return text.replace(/(?: \(.*?\))?\s+[—-]\s+(\S+)$/, " ($1)");
		}],
	title: "//td[contains(font/text(), 'Title')]/following-sibling::td[1]",
	date: ["//td[contains(font/text(), 'Date')]/following-sibling::td[1]",
		function(text) {
			return text.replace(/^(\d+).*/, "$1");
		}],
	description: "//td[contains(font/text(), 'Notes')]/following-sibling::td[text()]",
	source_image: ["//center/a[contains(@href,'LargeImage')]/@href || //center/img[contains(@src,'Images')][1]/@src",
		function(text) {
			return text.replace(/.*Images/, "http://www.jaodb.com/db/Images");
		}]
};

exports.genURL = function( id ) {
	return "http://www.jaodb.com/db/ItemDetail.asp?item=" + id;
};
