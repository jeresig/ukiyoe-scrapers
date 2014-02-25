{
	searchURL => 'http://www.honoluluacademy.org/art/collection/inf_scroll/%s.js?page_id=5785',
	searchStart => 1,
	searchEnd => 275,
	searchIncrement => 1,

	urlExtractor => scraper {
		process 'a', 'urls[]' => '@href';	
	},

	cleanURL => sub {
		my $url = shift;
		return $url !~ /inf_scroll/ ?
			"http://www.honoluluacademy.org$url" :
			"";
	},

	extractPageID => qr/\/(\d+)-/,

	pageExtractor => scraper {
		process "//h4[text()='Artist:']/following-sibling::p[1]", artist => 'TEXT';
		process "#art_detail_left img", title => '@alt';
		process "//h4[text()='Date:']/following-sibling::p[1]", date => 'TEXT';
		process "//h4[text()='Description:']/following-sibling::p[1]", description => 'TEXT';
		process "#art_detail_left img", source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;

		return $item;
	},

	extractImageFile => qr/image\/(\d+)/
}
