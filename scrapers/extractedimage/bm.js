exports.extract = {
	title: '//h1',
	artist: [ '//strong[contains(text(), "Production person")]/following-sibling::text()[contains(.," artist")] || //strong[contains(text(), "Production person")]/following-sibling::text()[1]', artist => artist.replace( /\s*\($/, "" )
        .replace( /^.*(of|to|by|artist|author|after|calligrapher) /i, "" ) ],
	date: '//strong[contains(text(), "Date")]/following-sibling::text()[1]',
	description: '//strong[contains(text(), "Description")]/following-sibling::text()[1]',
	source_image: [ '//div.imageContainer//img/@src', img => 'http://www.britishmuseum.org' + img.replace( /^file:../, "" )
        .replace( /_m/g, "_l" ) ]
};

exports.accept = (data, xmlData) => /\bJapan\b/.test( xmlData );

exports.genURL = id => "http://www.britishmuseum.org/research/search_the_collection_database/search_object_details.aspx?partid=1&objectid=" + id;
