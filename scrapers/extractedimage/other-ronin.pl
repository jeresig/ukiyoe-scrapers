{
	searchURL => 'http://www.roningallery.com/0/0/0/0/0/0/?per_page=60&page=%s',
	searchStart => 1,
	searchEnd => 29,
	searchIncrement => 1,

	urlExtractor => scraper {
		process "//td/a[img]", 'urls[]' => '@href';
	},

	cleanURL => sub {
		my ($url, $id) = @_;

		return $url =~ /prints\/(.*)$/ ?
			"http://www.roningallery.com/art/prints/$1" :
			"";
	},

	extractPageID => sub {
		my $url = shift;

		if ($url =~ qr/prints\/([^\/]+\/[^\/]+)\/$/) {
			return "$1_$2";
		}
	},

	pageExtractor => scraper {
		process '//a[img][contains(@href, "jpg")]', source_image => '@href';
	},

	cleanPage => sub {
		my $item = shift;

		$item->{'source_image'} = "http://www.roningallery.com/admin/includes/image_view.php?force=width&height=3000&width=3000&q=90&r=255&g=255&b=255&src=" . $item->{'image_file'};

		return $item;
	},

	extractImageFile => qr/src=([^\/]+)$/,

	cleanImageFile => sub {
		my $file = shift;
		return $file;
	}
}
