exports.extract = {
	artist: "//div[@class='narrow-column']//h3 || //label[contains(text(), 'Artist')]/following-sibling::span[1]",
	title: "//div[@class='narrow-column']//h2 || //label[contains(text(), 'Title/Object Name')]/following-sibling::text()[1]",
	date: "//dt[contains(text(), 'Date')]/following-sibling::dd[1] || //label[contains(text(), 'Date')]/following-sibling::text()[1]",
	source_image: '//img[contains(@src,"web-large")]/@src || //link[@rel="image_src"]/@href'
};

exports.genURL = function( id ) {
	return "http://www.metmuseum.org/Collections/search-the-collections/" + id;
};
