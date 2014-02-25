{
	searchURL => "http://digitalmuseum.rekibun.or.jp/app/collection/list?ss=01&b1=1000200&b2=2000220&b3=&sr=&sk=&y1=&y2=&w=&lang=en&start=%s",
	searchStart => 0,
	searchEnd => 6160,
	searchIncrement => 20,

	urlExtractor => scraper {
		# process '//a[text()="Detail"]', 'urls[]' => '@href';
		process '//a[text()="Detail"]', 'urls[]' => sub {
				my $a = shift;
				my $href = $a->attr('href');
				return "http://digitalmuseum.rekibun.or.jp$href";
			};
	},

	extractPageID => qr/id=(\d+)/,

	pageExtractor => scraper {
		process '//div[@id="imgMain"]/img', source_image => sub {
				my $img = shift;
				my $src = $img->attr('src');
				$src =~ s/740,300/1280,1280/;
				return "http://digitalmuseum.rekibun.or.jp$src";
			};
	},

	extractImageFile => qr/([^\/]+)\-/,

	cleanImageFile => sub {
		my $id = shift;
		return "01$id";
	}
}
