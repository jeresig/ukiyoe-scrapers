exports.extract = {
	artist: "//h4[text()='Artist:']/following-sibling::p[1]",
	title: "#art_detail_left//img/@alt",
	date: "//h4[text()='Date:']/following-sibling::p[1]",
	description: "//h4[text()='Description:']/following-sibling::p[1]",
	source_image: "#art_detail_left//img/@src",
};

exports.genURL = id => "http://www.honoluluacademy.org/art/" + id;

exports.getImage = name => /image\/(\d+)/.exec( name ) ?
    RegExp.$1 + ".jpg" :
    "";
