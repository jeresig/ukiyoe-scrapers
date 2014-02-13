{
	searchURL => 'http://webarchives.tnm.jp/imgsearch/search?invnum=A-&title=&creator=&excavation=&designation=&imageid1=&imageid2=&page=%s',
	searchStart => 1,
	searchEnd => 305,
	searchIncrement => 1,

	urlExtractor => scraper {
		#process '//a[contains(@href,"show")]', 'urls[]' => '@href';
		process '//div[contains(@class,"detail")][contains(.,"A-10569")]/preceding-sibling::a[1]', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;
		return $url =~ /([^\/]+)$/ ?
			"http://webarchives.tnm.jp/imgsearch/show/$1" :
			"";
	},

	extractPageID => qr/([^\/]+)$/,

	pageExtractor => scraper {
		process '//img[contains(@src, "1024")]', 'source_image' => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		#$item->{'source_image'} =~ s!thumb!1024!;
		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)$/
}
