exports.extract = {
	artist: "//td[contains(text(),'Artist')]/following-sibling::td",
	title: "//td[contains(text(),'Title')]/following-sibling::td",
	source_image: [ "//img[contains(@src,'.fpx')]/@src", function( text ) {
		return "http://digitalmuseum.rekibun.or.jp" 
			+ text.replace( '740,300', '1280,1280' );
	} ]
};

exports.genURL = function( id ) {
	return "http://digitalmuseum.rekibun.or.jp/app/collection/detail?ss=01&b1=1000200&b2=2000220&id=" + id;
};

exports.getImage = function( name ) {
    return /(\d*)\-/.exec( name ) ?
    "01" + RegExp.$1 + ".jpg" :
    "";
};
