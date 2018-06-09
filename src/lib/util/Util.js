const [SLASH, COLON] = [47, 58];

class Util {

	constructor() {
		throw new Error('This class cannot be initialised with new');
	}

	static parsePart(val) {
		const type = Number(val.charCodeAt(0) === COLON);
		if (type) val = val.substring(1);
		return { val, type };
	}

	static split(url) {
		if (url.length === 1 && url.charCodeAt(0) === SLASH) return [url];
		return url.split('/');
	}

	static parse(url) {
		return Util.split(url).map(Util.parsePart);
	}

}

module.exports = Util;
