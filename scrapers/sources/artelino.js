exports.extract = {
	artist: [ "//td[text()='Artist']/following-sibling::td[1]/a/text()", function( text ) { 
		var t = text.replace(/active.*$/,'');
		t = t.replace(/born.*$/,'');
		t = t.replace(/died.*$/,'');
		t = t.replace(/fl\..*$/,'');
		t = t.replace(/[Cc]a\..*$/,'');
		t = t.replace(/\d+.*$/,'');
		t = t.replace(/\(.*?\)/g, "").trim();
		t = t.replace(/^(.*)\s([IV]+)$/, '$2 $1');
		return t.split(/\s+/).reverse().join(' ');
	} ],
	title: "//td[text()='Title']/following-sibling::td[1]/text()",
	date: "//td[text()='Dated']/following-sibling::td[1]/text()",
	description: "//td[text()='Description']/following-sibling::td[1]/text()",
	source_image: [ "//p[@class='center']/a/img/@src", function( text ) {
			return text.replace(/a.jpg/,'g1.jpg');
	} ]
};

exports.genURL = function( id ) {
	return "http://www.artelino.com/archive/archivesearch_show.asp?act=go&sor=itm_item_id%20ASC&cay=1&sea=" + id;
};
