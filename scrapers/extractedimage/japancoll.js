exports.extract = {
	title: '//td[contains(.,"Title:")]/following-sibling::td',
	artist: '//td[contains(.,"Artist:")]/following-sibling::td',
	date: '//td[contains(.,"Date:")]/following-sibling::td',
	description: '//td[contains(.,"Series:")]/following-sibling::td',
	medium: '//td[contains(.,"Medium:")]/following-sibling::td',
	source_image: '//a[img][contains(@href, "jpg")]/@href'
};

exports.accept = data => {
	var pass = !/\S/.test(data.medium) || /Print/i.test(data.medium);
	delete data.medium;
	return pass;
};

exports.genURL = id => "http://www.japancollection.com/japanese-prints-uview/print.php?pid=" + id;
