export interface ParsedPart {
    value: string;
    type: number;
}
/**
 * Parses a url part
 * @param value The string part to parse
 */
export declare function parsePart(value: string): ParsedPart;
/**
 * Splits a url into it's parts
 * @param url The url to split
 */
export declare function split(url: string): string[];
/**
 * Splits and parses a url into it's parts.
 * @since 0.0.1
 * @param url The url to split and parse
 */
export declare function parse(url: string): ParsedPart[];
/**
 * Encrypts an object with aes-256-cbc to use as a token.
 * @since 0.0.1
 * @param data An object to encrypt
 * @param secret The secret to encrypt the data with
 */
export declare function encrypt(data: unknown, secret: string): string;
/**
 * Decrypts an object with aes-256-cbc to use as a token.
 * @since 0.0.1
 * @param token An data to decrypt
 * @param secret The secret to decrypt the data with
 */
export declare function decrypt(token: string, secret: string): unknown;
/**
 * Encodes an object to x-www-form-urlencoded
 * @since 0.0.2
 * @param data The object to form encode
 */
export declare function formEncode(data: Record<string, string>): string;
