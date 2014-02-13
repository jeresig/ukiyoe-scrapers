exports.extract = {
	artist: "//div.object-info//a[contains(@href, 'artist=')]",
	title: "#mainRightColumn/h1",
	date: [ "//*[contains(*/@href, 'artist=')]/preceding-sibling::*[1]", function( date ) {
		return /([\d–]{4,})/.exec( date ) ?
			RegExp.$1.replace( /–/g, "-" ) :
			date;
	}],
	// description: null,
	source_image: [ "//img.object-large-image/@src", function( img ) {
		return img.replace( /fpx.*$/, "fpx&obj=iip,1.0&wid=15008&cell=2000,1500&cvt=jpeg" );
	}]
};

exports.genURL = function( id ) {
	return "http://www.mfa.org/collections/object/" + id;
};

exports.getImage = function( name ) {
	return /([^\/]+).fpx/.exec( name ) ?
		RegExp.$1 + ".jpg" :
		"";
};
