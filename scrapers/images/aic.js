exports.extract = {
	artist: "#tombstone/p/a/child::text()[position()=1]",
	title: "#tombstone//.italic",
	date: [ "#tombstone/p/child::text()", function( text ) {
		return text.replace( /^,\s*/, "" );
	} ],
	description: "#tombstone//p[position()=3]",
	source_image: "a.enlargement-link/@href || #artwork-image/img/@src"
};

exports.genURL = function( id ) {
	return "http://www.artic.edu/aic/collections/artwork/" + id;
};
