{
	searchURL => 'http://gallery.famsf.org/gallery/ajaxSearchResults.htm?rnd=0.025945667177438736&page=1&count=200&keyword=woodcut&artistName=Search+By+Artist&title=Search+By+Title&accessionNumber=Search+By+Accession&barCode=Search+By+Bar+Code&century=&country=Japan&exhibit=&gallery=&building=&myGalleryId=&format=json',
	searchEnd => 14,
	searchStart => 1,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//td[text()="webpath"]/following-sibling::td[1]', 'urls[]' => 'TEXT';
	},

	extractPageID => qr/(.*)/,

	pageExtractor => scraper {
		process 'artist', artist => 'TEXT';
		process 'label', description => 'TEXT';
		process 'title', title => 'TEXT';
		process 'date', date => 'TEXT';
		process 'img.screen', source_image => '@src';
	},

	extractImageFile => qr/([^\/]+)$/
}
