{
	searchURL => 'http://www.artic.edu/aic/collections/search-artwork/results/keyword%3Awoodblock?page=%s',
	searchStart => 0,
	searchEnd => 225,
	searchIncrement => 1,

	urlExtractor => scraper {
		process 'span.italic a', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;
		return $url =~ /(artwork\/\d+)/ ?
			"http://www.artic.edu/aic/collections/$1" :
			"";
	},

	extractPageID => qr/artwork\/(\d+)/,

	pageExtractor => scraper {
		process "id('tombstone')/p/a/child::text()", artist => 'TEXT';
		process "#tombstone .italic", title => 'TEXT';
		process "id('tombstone')/p/child::text()", date => 'TEXT';
		process "#tombstone p:nth-child(3)", description => 'TEXT';
		process "a.enlargement-link", source_image => '@href';
	},

	cleanPage => sub {
		my $item = shift;

		$item->{'source_url'} = "http://www.artic.edu/aic/collections/artwork/" . $item->{'source_id'};
		$item->{'date'} =~ s/^,\s*//;

		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)$/
}
