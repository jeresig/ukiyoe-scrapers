exports.extract = {
	artist: ["//h1/a", text => text.replace(/\(.*?\)/g, "")],
	date: ["//div[@id='main_text']", text => {
		if ( /.*(1[678]\d{2})/.test(text) ) {
			return RegExp.$1;
		}
		return "";
	}],
	description: "//div[@id='main_text']",
	"source_images[]": "//a[contains(@class,'zoom')]/@href"
};

exports.genURL = id => "http://www.japaneseprints-london.com/" + id;
