exports.extract = {
	title: '//td[@class="detail_left_fieldname"][text()="Title:"]/following-sibling::td[2]',
	artist: [ '//td[@class="detail_left_fieldname"][text()="Design:"]/following-sibling::td[2]', artist => {
		if ( artist.indexOf("=") >= 0 ) {
			artist = artist.split( "=" )[1];
		}

		return artist.replace( / \(.*/, "" ).replace( /\./g, "" );	
	}],
	date: '//td[@class="detail_left_fieldname"][text()="Date:"]/following-sibling::td[2]',
	description: '//td[@class="detail_left_fieldname"][text()="Series:"]/following-sibling::td[2]',
	source_image: [ '//img[contains(@src,"Ukiyoe")]/@src', name => 'http://sammlungen.mak.at' +
        name.replace( /^file:../, "" ).replace( /tn2_/, "tn3_" )]
};

exports.genURL = id => "http://sammlungen.mak.at/sdb/do/detail.state?obj_id=" + id;

exports.getImage = name => /%20([\d-]+.jpg)/.exec( name )[1];
