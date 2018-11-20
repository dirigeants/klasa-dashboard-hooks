const { createDecipheriv, createCipheriv, randomBytes } = require('crypto');

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

	/**
	 * Encrypts an object with aes-256-cbc to use as a token
	 * @param {any} data An object to encrypt
	 * @param {string} secret The secret to encrypt the data with
	 * @returns {string}
	 */
	static encrypt(data, secret) {
		const iv = randomBytes(16);
		const cipher = createCipheriv('aes-256-cbc', secret, iv);
		return `${cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64')}.${iv.toString('base64')}`;
	}

	/**
	 * Decrypts an object with aes-256-cbc to use as a token
	 * @param {string} token An data to decrypt
	 * @param {string} secret The secret to decrypt the data with
	 * @returns {any}
	 */
	static decrypt(token, secret) {
		const [data, iv] = token.split('.');
		const decipher = createDecipheriv('aes-256-cbc', secret, Buffer.from(iv, 'base64'));
		return JSON.parse(decipher.update(data, 'base64', 'utf8') + decipher.final('utf8'));
	}

}

module.exports = Util;
