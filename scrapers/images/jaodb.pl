{
	searchURL => 'http://www.jaodb.com/db/sitemap.asp',
	searchStart => 0,
	searchEnd => 0,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//a', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;
		return $url =~ /(\d+)/ ?
			"http://www.jaodb.com/db/ItemDetail.asp?item=$1" :
			"";
	},

	extractPageID => qr/(\d+)/,

	pageExtractor => scraper {
		process '//center/a[contains(@href,"LargeImage")]', source_image => '@href';
		process '//img[contains(@src,"F06")]', small_image => '@src';
		process '//a[contains(@href,"ItemDetail")]', 'urls[]' => '@href';
	},

	cleanPage => sub {
		my $item = shift;

		if ( !$item->{'source_image'} ) {
			$item->{'source_image'} = $item->{'small_image'};
		}

		delete $item->{'small_image'};

		$item->{'source_image'} =~ s!.*Images!http://www.jaodb.com/db/Images!;

		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)$/
}
