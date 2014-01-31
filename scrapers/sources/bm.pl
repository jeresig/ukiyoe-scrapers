{
	searchURL => 'http://www.britishmuseum.org/research/search_the_collection_database/search_results.aspx?images=on&numPages=100&searchText=woodblock&currentPage=%s',
	searchStart => 1,
	searchEnd => 98,
	searchIncrement => 1,

	urlExtractor => scraper {
		process 'ul.researchGallery span a', 'urls[]' => '@href';	
	},

	cleanURL => sub {
		return 'http://www.britishmuseum.org' . $_[0];
	},

	extractPageID => qr/objectid=(\d+)/,

	pageExtractor => scraper {
		process 'h1', title => 'TEXT';
		process '//strong[contains(text(), "Production person")]/following-sibling::text()[1]', artist => 'TEXT';
		process '//strong[contains(text(), "Date")]/following-sibling::text()[1]', date => 'TEXT';
		process '//strong[contains(text(), "Description")]/following-sibling::text()[1]', description => 'TEXT';
		process 'div.imageContainer img', source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		$item->{'source_image'} =~ s/^file:..//;
		$item->{'source_image'} =~ s/_m/_l/;
		$item->{'source_image'} = 'http://www.britishmuseum.org' . $item->{'source_image'};
		$item->{'artist'} =~ s/\s*\($//;
		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)/
}
