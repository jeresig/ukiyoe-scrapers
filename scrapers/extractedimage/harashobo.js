exports.extract = {
	artist: "//td[@class='txt1']/br/preceding-sibling::text()[4]",
	title: "//td[@class='txt1'][3]/text()[2]", 
	date: [ '//td[@class="txt1"][3]/text()[contains(.,"1")]', function( text ) {
		return /([0-9]{4,})/.test( text ) ? RegExp.$1 : "";
	} ],
	description: '//td[@class="txt1"][3]/text()[3]',
	source_image: [ "//img[contains(@src, '_')]/@src", function( text ) {
		return "http://harashobo.com/img" + text.replace(/\.\.\/img/,'').replace(/\d\./,'3.');
	} ]
};

exports.genURL = function( id ) {
	return "http://harashobo.com/english/selection_list.php?&mode=1&page=" + id;
};
