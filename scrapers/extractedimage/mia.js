exports.extract = {
	title: [ '//span[@class="label"][text()="Title:"]/following-sibling::span[1]', title => title.replace( /_/g, "" ) ],
	artist: [ '//span[@class="label"][text()="Artist:"]/following-sibling::span[1]/text()[1]', artist => artist.replace( /\s*et\s*al\.?/, "" ).replace( /attributed to/, "" )
        .replace( /^(.*\s)(I+)(\s.*)$/, "$1$3 $2" ) ],
	date: '//span[@class="label"][text()="Date:"]/following-sibling::span[1]',
	description: [ '#primary_text || //span[@class="label"][text()="Physical Description:"]/following-sibling::span[1]', desc => desc.replace( /_/g, "" ) ],
	source_image: [ "#g_image//img/@src", name => name.replace( /\d+\/medium/, "large" ) ]
};

exports.reverseName = true;

exports.genURL = id => "http://www.artsmia.org/viewer/detail.php?id=" + id + "&v=2&dept[]=13&dept[]=1&class=print";

exports.getImage = name => /images\/(\d+)/.exec( name ) ?
    RegExp.$1 + ".jpg" :
    null;
