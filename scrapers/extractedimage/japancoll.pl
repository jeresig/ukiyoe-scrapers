{
	searchURL => 'http://www.japancollection.com/japanese-prints-search/allprices-allartists-allsubjects.php?y=1&ppp=100&pg=%s',
	searchStart => 1,
	searchEnd => 52,
	searchIncrement => 1,

	urlExtractor => scraper {
		process "//td/a[img]", 'urls[]' => '@href';
	},

	cleanURL => sub {
		my $url = shift;

		return $url =~ /pid=(\d+)/ ?
			"http://www.japancollection.com/japanese-prints-uview/print.php?pid=$1" :
			"";
	},

	extractPageID => qr/pid=(\d+)/,

	pageExtractor => scraper {
		process '//a[img][contains(@href, "jpg")]', source_image => '@href';
	},

	cleanPage => sub {
		my $item = shift;
		return $item;
	},

	extractImageFile => qr/([^\/]+)$/,

	cleanImageFile => sub {
		my $file = shift;
		$file =~ s/[: ]/_/g;
		return $file;
	}
}
