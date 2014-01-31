exports.extract = {
	artist: ["//h1/a", function(text) {
		return text.replace(/\(.*?\)/g, "");
	}],
	date: ["//div[@id='main_text']", function(text) {
		if ( /.*(1[678]\d{2})/.test(text) ) {
			return RegExp.$1;
		}
		return "";
	}],
	description: "//div[@id='main_text']",
	"source_images[]": "//a[contains(@class,'zoom')]/@href"
};

exports.genURL = function( id ) {
	return "http://www.japaneseprints-london.com/" + id;
};
