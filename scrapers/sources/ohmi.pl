{
	searchURL => 'http://www.ohmigallery.com/DB/sitemap.asp',
	searchStart => 0,
	searchEnd => 0,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//a', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;
		return $url =~ /(\d+)$/ ?
			"http://www.ohmigallery.com/DB/ItemDetail.asp?item=$1" :
			"";
	},

	extractPageID => qr/(\d+)/,

	pageExtractor => scraper {
		process '//center/a[contains(@href,"LargeImage")]', source_image => '@href';
	},

	cleanPage => sub {
		my $item = shift;
		$item->{'source_image'} =~ s!.*Images!http://www.ohmigallery.com/DB/Images!;
		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)$/
}
