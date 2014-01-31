{
	searchStart => 1,
	searchIncrement => 1,
	searches => [ 
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2012&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 73
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2011&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 237
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2010&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 204
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2009&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 223
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2008&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 323
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2007&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 429
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2006&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 389
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2005&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 328
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2004&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 194
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2003&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 69
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2002&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 12
	    },
	    {
		searchURL => 'http://www.artelino.com/archive/archivesearch.asp?act=go&ars=0&cay=1&date_yyyy=2001&exc=&evt=0&pp=%s&pp1=1&ped=0&rp=1&rp1=1&rp2=1&lvl=2&sea=&sor=itm_item_id%20DESC&sou=itemarchivem&suy=0&sut=0&tee=44',
		searchEnd => 1
	    }
	    ],

	encoding => "latin-1",

	urlExtractor => scraper {
		process '//a[@name]', 'urls[]' => 'TEXT';
	},

	cleanURL => sub {
		my $url = shift;
		return $url =~ /(\d+)/ ?
			"http://www.artelino.com/archive/archivesearch_show.asp?act=go&sor=itm_item_id%20ASC&sea=$1" :
			"";
	},

	extractPageID => qr/sea=(\d+)$/,

	pageExtractor => scraper {
		process '//td[text()="Artist"]/following-sibling::td[1]', artist => 'TEXT';
		process '//td[text()="Title"]/following-sibling::td[1]', title => 'TEXT';
		process '//td[text()="Dated"]/following-sibling::td[1]', date => 'TEXT';
		process '//td[text()="Description"]/following-sibling::td[1]', description => 'TEXT';
		process 'p.center a img', source_image => sub {
				my $elem = shift;
				my $text = $elem->attr('src');
				$text =~ s/a.jpg/g1.jpg/;
				return $text;
			};
	},

	# cleanPage => sub { },

	extractImageFile => qr/([^\/]+)$/
}
