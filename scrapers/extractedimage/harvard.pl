{
	searchURL => 'http://www.harvardartmuseums.org/art/search?search_api_aggregation_1=&field_artist_search=&field_title_search=&field_artist_search_1=&field_title_search_1=&field_object_number=&field_date_begin=&field_date_end=&field_department=&field_classification=Prints&field_technique=&field_century=&field_period=&field_culture=Japanese&field_creation_place=&field_subject=&field_has_image=1&page=%s',
	searchStart => 0,
	searchEnd => 211,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//td/a[img]', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;
		return $url;
	},

	extractPageID => qr/art\/(\d+)/,

	pageExtractor => scraper {
		process '//img[contains(@class,"cur_img")]', source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;

		$item->{'source_image'} =~ s/=\d+/=2000/g;

		return $item;
	},

	extractImageFile => qr/urn-3:(.*?)_dynmc/,

	cleanImageFile => sub {
		my $file = shift;
		$file =~ s/:/-/g;
		return $file;
	}
}
