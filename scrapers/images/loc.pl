{
	searchURL => 'http://www.loc.gov/pictures/search/?sp=%s&co=jpd&st=grid',
	searchStart => 1,
	searchEnd => 27,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//div//a[contains(@href, "collection/jpd/item")]', 'urls[]' => '@href';	
	},

	extractPageID => qr/(\d+)/,

	pageExtractor => scraper {
		process '//li[contains(text(), "Title Translation:")]/span', title => 'TEXT';
		process '//li[contains(text(), "Creator(s):")]//a', artist => 'TEXT';
		process '//li[contains(text(), "Date Created")]/span', date => 'TEXT';
		process '//a[contains(@href, "v.jpg")]', source_image => '@href';
		process '//li[contains(text(), "Summary:")]/span', description => 'TEXT';
	},

	extractImageFile => qr/([^\/]+.jpg)/
}
