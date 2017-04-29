var root = "//div[@style='margin-left: 2em']/child::text()";
var ids = {};

exports.extract = {
	artist: [ root + "[contains(., 'ARTIST:')]", text => /.*ARTIST:\s*([^(]+)\s*/.test( text ) ? RegExp.$1 : "" ],
	title: [ root + "[contains(., 'TITLE')] || //font[@size='4']/b[count(node()) = 1]", text => /TITLE.*?:\s*(.*?)(?:SIG|$)/.test( text ) ? RegExp.$1 : "" ],
	date: [ root + "[contains(., 'DATE')]", text => /DATE.*?:\s*(.*?)(?:[A-Z]{2,}|$)/.test( text ) ? RegExp.$1 : "" ],
	description: [ root + "[contains(., 'SERIES')]", text => /SERIES.*?:\s*(.*)/.test( text ) ? RegExp.$1 : "" ],
	source_image: [ '//img[contains(@src,"fullsize")]/@src', text => text.replace( /^.*?full/, "http://woodblockprint.net/full" ) ]
};

exports.accept = (data, xmlData) => {
	if ( /\((.*?)\)<\/title>/.test( xmlData ) ) {
		var id = RegExp.$1;

		if ( ids[id] ) {
			return false;
		}

		ids[id] = true;
	}

	return !/(?:TEST|WOODBLOCK)/.test( id ) && !/(?:References|Books|Posters|Mezzotint|Silkscreen|Chinese Modern Prints|Scrolls|Lithograph|Western Artists|Brush Paintings|Digital painting|Hoke Art|Catalogues)/i.test( xmlData );
};

exports.genURL = id => "http://www.woodblockprint.net/listings/details/index.cfm?itemnum=" + id + "&BIDDERID=";
