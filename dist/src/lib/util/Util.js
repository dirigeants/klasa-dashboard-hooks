"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formEncode = exports.decrypt = exports.encrypt = exports.parse = exports.split = exports.parsePart = void 0;
const crypto_1 = require("crypto");
const [SLASH, COLON] = [47, 58];
/**
 * Parses a url part
 * @param value The string part to parse
 */
function parsePart(value) {
    const type = Number(value.charCodeAt(0) === COLON);
    if (type)
        value = value.substring(1);
    return { value, type };
}
exports.parsePart = parsePart;
/**
 * Splits a url into it's parts
 * @param url The url to split
 */
function split(url) {
    if (url.length === 1 && url.charCodeAt(0) === SLASH)
        return [url];
    else if (url.charCodeAt(0) === SLASH)
        url = url.substring(1);
    return url.split('/');
}
exports.split = split;
/**
 * Splits and parses a url into it's parts.
 * @since 0.0.1
 * @param url The url to split and parse
 */
function parse(url) {
    return split(url).map(parsePart);
}
exports.parse = parse;
/**
 * Encrypts an object with aes-256-cbc to use as a token.
 * @since 0.0.1
 * @param data An object to encrypt
 * @param secret The secret to encrypt the data with
 */
function encrypt(data, secret) {
    const iv = crypto_1.randomBytes(16);
    const cipher = crypto_1.createCipheriv('aes-256-cbc', secret, iv);
    return `${cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64')}.${iv.toString('base64')}`;
}
exports.encrypt = encrypt;
/**
 * Decrypts an object with aes-256-cbc to use as a token.
 * @since 0.0.1
 * @param token An data to decrypt
 * @param secret The secret to decrypt the data with
 */
function decrypt(token, secret) {
    const [data, iv] = token.split('.');
    const decipher = crypto_1.createDecipheriv('aes-256-cbc', secret, Buffer.from(iv, 'base64'));
    return JSON.parse(decipher.update(data, 'base64', 'utf8') + decipher.final('utf8'));
}
exports.decrypt = decrypt;
/**
 * Encodes an object to x-www-form-urlencoded
 * @since 0.0.2
 * @param data The object to form encode
 */
function formEncode(data) {
    return Object.keys(data).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
}
exports.formEncode = formEncode;
//# sourceMappingURL=Util.js.map