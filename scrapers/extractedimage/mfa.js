exports.extract = {
	artist: "//div.object-info//a[contains(@href, 'artist=')]",
	title: "#mainRightColumn/h1",
	date: [ "//*[contains(*/@href, 'artist=')]/preceding-sibling::*[1]", date => /([\d–]{4,})/.exec( date ) ?
        RegExp.$1.replace( /–/g, "-" ) :
        date],
	// description: null,
	source_image: [ "//img.object-large-image/@src", img => img.replace( /fpx.*$/, "fpx&obj=iip,1.0&wid=15008&cell=2000,1500&cvt=jpeg" )]
};

exports.genURL = id => "http://www.mfa.org/collections/object/" + id;

exports.getImage = name => /([^\/]+).fpx/.exec( name ) ?
    RegExp.$1 + ".jpg" :
    "";
