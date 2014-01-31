{
	searchURL => 'http://www.dh-jac.net/db/arcnishikie/FMPro?-db=nishikie.fmj&-format=resultsp.htm&-lay=layout2&-sortfield=-None-&-sortfield=-none-&-sortfield=-none-&f00=%3d%22%8c%f6%8a%4a%22&f00=%3d%22%8c%f6%8a%4a%22&f49=%8d%91%89%ef%90%7d%8f%91%8a%d9&f11=1&f11=1&-max=100&-find=',

	urlExtractor => scraper {
		process '//a[contains(@href,"results-bigp")]', 'urls[]' => '@alt';
		process '//a[contains(text(),"次ページ")]', 'nextURL' => '@href';
	},

	cleanURL => sub {
		my ($url, $id) = @_;
		if ($url =~ /([\d-]+)/) {
			return "http://www.dh-jac.net/db/arcnishikie-e/FMPro?-db=nishikie.fmj&-lay=layout2&-sortfield=-none-&-sortfield=f1&f00=%3d%22%8c%f6%8a%4a%22&f1=%8d%91%89%ef$1&f11=1&-max=30&-Format=results-bigp.htm&-max=1&-Find";
		}
	},

	extractPageID => qr/(\d{3}-\d{2}-\d{3})/,

	pageExtractor => scraper {
		process '//img[contains(@src, "jpg")]', source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		return $item;
	},

	extractImageFile => qr/(W0.*)$/i,

	cleanImageFile => sub {
		my $file = shift;
        $file =~ s/[w0]//ig;
        $file =~ s/\//-/g;
		return $file;
	}
}
