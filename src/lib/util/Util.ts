import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';

const [SLASH, COLON] = [47, 58];

export interface ParsedPart {
	value: string;
	type: number;
}

/**
 * Parses a url part
 * @param value The string part to parse
 */
export function parsePart(value: string): ParsedPart {
	const type = Number(value.charCodeAt(0) === COLON);
	if (type) value = value.substring(1);
	return { value, type };
}

/**
 * Splits a url into it's parts
 * @param url The url to split
 */
export function split(url: string): string[] {
	if (url.length === 1 && url.charCodeAt(0) === SLASH) return [url];
	else if (url.charCodeAt(0) === SLASH) url = url.substring(1);
	return url.split('/');
}

/**
 * Splits and parses a url into it's parts.
 * @since 0.0.1
 * @param url The url to split and parse
 */
export function parse(url: string): ParsedPart[] {
	return split(url).map(parsePart);
}

/**
 * Encrypts an object with aes-256-cbc to use as a token.
 * @since 0.0.1
 * @param data An object to encrypt
 * @param secret The secret to encrypt the data with
 */
export function encrypt(data: unknown, secret: string): string {
	const iv = randomBytes(16);
	const cipher = createCipheriv('aes-256-cbc', secret, iv);
	return `${cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64')}.${iv.toString('base64')}`;
}

/**
 * Decrypts an object with aes-256-cbc to use as a token.
 * @since 0.0.1
 * @param token An data to decrypt
 * @param secret The secret to decrypt the data with
 */
export function decrypt(token: string, secret: string): unknown {
	const [data, iv] = token.split('.');
	const decipher = createDecipheriv('aes-256-cbc', secret, Buffer.from(iv, 'base64'));
	return JSON.parse(decipher.update(data, 'base64', 'utf8') + decipher.final('utf8'));
}
