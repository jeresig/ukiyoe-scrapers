{
	searchURL => 'http://www.metmuseum.org/collections/search-the-collections?where=Japan&ft=woodblock&ao=on&noqs=true&rpp=60&pg=%s',
	searchStart => 1,
	searchEnd => 69,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//div[@class="image-container"]//a[contains(@href,"search-the-collections")][img]', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;
		return $url =~ /search-the-collections\/(\d+)/ ?
			"http://www.metmuseum.org/Collections/search-the-collections/$1" :
			"";
	},

	extractPageID => qr/search-the-collections\/(\d+)/,

	pageExtractor => scraper {
		process '//img[contains(@src,"web-large")]', 'source_image' => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		#$item->{'source_image'} =~ s!thumb!1024!;
		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)$/
}
