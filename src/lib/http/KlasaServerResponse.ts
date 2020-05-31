import { ServerResponse } from 'http';

/**
 * The server response for KDH when using HTTP/HTTPS
 */
export class KlasaServerResponse extends ServerResponse {

	/**
	 * Sets the status code of this response
	 * @param code The status code to set the response to
	 */
	public status(code: number): this {
		this.statusCode = code;
		return this;
	}

	/**
	 * Ends the response with JSON.stringified data
	 * @param data The data to respond with
	 */
	public json(data: unknown): void {
		return this.end(JSON.stringify(data));
	}

}
