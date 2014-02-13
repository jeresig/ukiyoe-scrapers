{
	searchURL => 'http://www.japaneseprints-london.com/page/%s/?s',
	searchStart => 1,
	searchEnd => 33,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//h1/a', 'urls[]' => '@href';
	},

	#cleanURL => sub {
		#my $url = shift;
		#return $url =~ /(\d+)$/ ?
			#"http://www.ohmigallery.com/DB/ItemDetail.asp?item=$1" :
			#"";
	#},

	extractPageID => qr/\/(\d+)\//,

	pageExtractor => scraper {
		process '//a[contains(@class,"zoom")]', 'source_images[]' => '@href';
	},

	cleanPage => sub {
		my $item = shift;
		#$item->{'source_image'} =~ s!.*Images!http://www.ohmigallery.com/DB/Images!;
		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)$/
}
