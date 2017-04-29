exports.extract = {
	artist: ["//td[contains(font/text(), 'Artist')]/following-sibling::td[1]",
		text => text.replace(/ [\(-].*/, "")],
	title: "//td[contains(font/text(), 'Title')]/following-sibling::td[1]",
	date: ["//td[contains(font/text(), 'Date')]/following-sibling::td[1]",
		text => text.replace(/^(\d+).*/, "$1")],
	description: "//td[contains(font/text(), 'Notes')]/following-sibling::td[1]",
	source_image: ["//center/a[contains(@href,'LargeImage')]/@href",
		text => text.replace(/.*Images/, "http://www.ohmigallery.com/DB/Images")]
};

exports.genURL = id => "http://www.ohmigallery.com/DB/ItemDetail.asp?item=" + id;
