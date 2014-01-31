{
	preRequest => 'http://www.woodblockprint.net/search/index.cfm',

	searchURL => 'http://www.woodblockprint.net/search/search_results.cfm?search_type=title_search&search_name=Title+%26+Description+Search&search_text=*&phrase_match=any&category=-1&search_span=title&search_limit=all&country_type=in&country=&order_by=title&sort_order=ASC&PgNum=%s',
	searchStart => 1,
	searchEnd => 548,
	searchIncrement => 1,

	urlExtractor => scraper {
		process '//td[@align="center"][//img]/following-sibling::td[1]//font/a[contains(@href, "itemnum")]', 'urls[]' => '@href';	
	},

	cleanURL => sub {
		return 'http://www.woodblockprint.net' . $_[0] . '&BIDDERID=';
	},

	extractPageID => qr/itemnum=(\d+)/,

	pageExtractor => scraper {
		process '//title', title => 'TEXT';
		process '//img[contains(@src,"fullsize")]', source_image => '@src';
	},

	cleanPage => sub {
		my $item = shift;
		$item->{'source_image'} =~ s/^.*fullsize//;
		$item->{'source_image'} = 'http://www.woodblockprint.net/fullsize' . $item->{'source_image'};
		return $item;
	},

	extractImageFile => qr/([^\/]+.jpg)/
}
