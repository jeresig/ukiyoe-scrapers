my $haraCount = 0;
{
	searchURL => "http://www.harashobo.com/english/selection_list.php?&page=%s&mode=0",
	searchStart => 0,
	searchEnd => 2700,
	searchIncrement => 10,

	encoding => "latin-1",

	urlExtractor => scraper {
		# process "//a[text()='>>Detail']", 'urls[]' => '@href';
		process '//img[contains(@src,"_")]', 'urls[]' => '@href';
	},

	cleanURL => sub {
		return "http://www.harashobo.com/english/selection_list.php?&page="
			. $haraCount++ . "&mode=1";
	},

	extractPageID => qr/page=(\d+)/,

	pageExtractor => scraper {
		process '//td[@class=\'txt1\']/img', source_image => sub {
				my $img = shift;
				my $src = $img->attr('src');
				$src =~ s/\.\.\///;
				$src =~ s/\d\./3\./;
				return "http://www.harashobo.com/$src";
			};
	},

	extractImageFile => qr/([^\/]+)$/
}
