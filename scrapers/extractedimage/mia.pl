{
	searchURL => 'http://www.artsmia.org/viewer/index.php?&v=2&dept[]=13&dept[]=1&class=print&start=%s',
	searchStart => 1,
	searchEnd => 3061,
	searchIncrement => 12,

	urlExtractor => scraper {
		process '//div[@class="result_label"]/a[contains(@href,"detail")]', 'urls[]' => '@href';	
	},

	cleanURL => sub {
		return "http://www.artsmia.org/viewer/" . $_[0];
	},

	extractPageID => qr/id=(\d+)/,

	pageExtractor => scraper {
		process '//span[@class="label"][text()="Title:"]/following-sibling::span[1]', title => 'TEXT';
		process '//span[@class="label"][text()="Artist:"]/following-sibling::span[1]', artist => 'TEXT';
		process '//span[@class="label"][text()="Date:"]/following-sibling::span[1]', date => 'TEXT';
		process "#g_image img", source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		$item->{'source_image'} =~ s/\d+\/medium/large/;
		return $item;
	},

	extractImageFile => qr/images\/(\d+)/
}
