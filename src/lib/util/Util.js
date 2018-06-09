const [SLASH, COLON] = [47, 58];

/**
 * Utility function class
 * <danger>This class cannot be initialized with new</danger>
 */
class Util {

	/**
	 * @typedef {Object} ParsedPart
	 * @property {string} val The value of the url part
	 * @property {number} type The type of url part (0 for static, 1 for variable)
	 */

	constructor() {
		throw new Error('This class cannot be initialized with new');
	}

	/**
	 * Parses a url part
	 * @param {string} val The string part to parse
	 * @returns {ParsedPart}
	 */
	static parsePart(val) {
		const type = Number(val.charCodeAt(0) === COLON);
		if (type) val = val.substring(1);
		return { val, type };
	}

	/**
	 * Splits a url into it's parts
	 * @param {string} url The url to split
	 * @returns {string[]}
	 */
	static split(url) {
		if (url.length === 1 && url.charCodeAt(0) === SLASH) return [url];
		else if (url.charCodeAt(0) === SLASH) url = url.substring(1);
		return url.split('/');
	}

	/**
	 * Splits and parses a url into it's parts
	 * @param {string} url The url to split and parse
	 * @returns {ParsedPart[]}
	 */
	static parse(url) {
		return Util.split(url).map(Util.parsePart);
	}

}

module.exports = Util;
