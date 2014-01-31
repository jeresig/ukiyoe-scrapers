{
	preRequest => 'http://sammlungen.mak.at/sdb/do/sammlung.state?id=0&langSelect=en',

	searchURL => 'http://sammlungen.mak.at/sdb/do/sammlung.state?pageOffset=%s',
	searchStart => 0,
	searchEnd => 343,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '.content_item a', 'urls[]' => '@href';	
	},

	cleanURL => sub {
		return 'http://sammlungen.mak.at' . $_[0];
	},

	extractPageID => qr/obj_id=(\d+)/,

	pageExtractor => scraper {
		process '//td[@class="detail_left_fieldname"][text()="Title:"]/following-sibling::td[2]', title => 'TEXT';
		process '//td[@class="detail_left_fieldname"][text()="Design:"]/following-sibling::td[2]', artist => 'TEXT';
		process '//td[@class="detail_left_fieldname"][text()="Date:"]/following-sibling::td[2]', date => 'TEXT';
		process '//td[@class="detail_left_fieldname"][text()="Series:"]/following-sibling::td[2]', description => 'TEXT';
		process '//img[contains(@src,"Ukiyoe")]', source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		$item->{'source_image'} =~ s/^file:..//;
		$item->{'source_image'} =~ s/tn2_/tn3_/;
		$item->{'source_image'} = 'http://sammlungen.mak.at' . $item->{'source_image'};
		return $item;
	},

	extractImageFile => qr/%20([\d-]+.jpg)/
}
