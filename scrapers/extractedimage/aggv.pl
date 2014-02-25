{
	searchURL => 'http://aggv.ca/collection/advanced?page=%s&field_artist_value=&title=&field_acc_num_value=&field_credit_value=&field_culture_value=Japanese&field_description_value=&field_material_value=&field_medium_value=woodcut&field_obj_type_value=&field_period_value=&field_subject_value=&field_support_value=&field_paris_num_value=',
	searchStart => 0,
	searchEnd => 157,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//a[img[not(contains(@src,"no_image"))][not(contains(@src,"copyright"))]]', 'urls[]' => '@href';
	},

	cleanURL => sub {
		my ($url, $id) = @_;
		return "http://aggv.ca/artwork/$id";
	},

	extractPageID => qr/artwork\/(.*?)$/,

	pageExtractor => scraper {
		process '//img[contains(@class, "imagecache")]', source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		return $item;
	},

	extractImageFile => qr/([^\/]+)$/,

	cleanImageFile => sub {
		my $file = shift;
		return $file;
	}
}
