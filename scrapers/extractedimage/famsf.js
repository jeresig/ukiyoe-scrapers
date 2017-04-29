exports.extract = {
	artist: "//p[@id='artist']",
	title: "//title",
	date: "//p[@id='date']",
	description: "//[@id='label']",
	source_image: "//img[@id='screen']/@src"
};

exports.genURL = (id, data) => {
	if ( data.description && /([\d.]+)$/.test( data.description ) ) {
		return "http://gallery.famsf.org/gallery/artworkSearch.htm?accessionNumber=" + RegExp.$1;
	}

	return "http://legionofhonor.famsf.org/search-collections";
};
