exports.extract = {
	artist: ["//td[contains(font/text(), 'Artist:')]/following-sibling::td[1]",
		text => text.replace(/(?: \(.*?\))?\s+[—-]\s+(\S+)$/, " ($1)")],
	title: "//td[contains(font/text(), 'Title')]/following-sibling::td[1]",
	date: ["//td[contains(font/text(), 'Date')]/following-sibling::td[1]",
		text => text.replace(/^(\d+).*/, "$1")],
	description: "//td[contains(font/text(), 'Notes')]/following-sibling::td[text()]",
	source_image: ["//center/a[contains(@href,'LargeImage')]/@href || //center/img[contains(@src,'Images')][1]/@src",
		text => text.replace(/.*Images/, "http://www.jaodb.com/db/Images")]
};

exports.genURL = id => "http://www.jaodb.com/db/ItemDetail.asp?item=" + id;
