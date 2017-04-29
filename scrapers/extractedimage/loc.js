exports.extract = {
	title: '//li[contains(text(), "Title Translation:")]/span || //li[contains(text(), "Title:")]/span',
	artist: [ '//li[contains(text(), "Creator(s):")]//a || //li[contains(text(), "Related Names:")]//a', artist => artist.split( /,\s*/ ).slice( 0, -1 ).join( " " ) ],
	date: '//li[contains(text(), "Date Created")]/span',
	source_image: '//link[contains(@href, "v.jpg")]/@href',
	description: '//li[contains(text(), "Summary:")]/span',
};

exports.genURL = id => "http://www.loc.gov/pictures/collection/jpd/item/" + id + "/"
