import { Http2ServerResponse } from 'http2';

/**
 * The server response for KDH when using HTTP2
 */
export class KlasaHttp2ServerResponse extends Http2ServerResponse {

	/**
	 * Sets the status code of this response.
	 * @since 0.0.1
	 * @param code The status code to set the response to
	 */
	public status(code: number): this {
		this.statusCode = code;
		return this;
	}

	/**
	 * Ends the response with JSON.stringified data.
	 * @since 0.0.1
	 * @param data The data to respond with
	 */
	public json(data: unknown): void {
		return this.end(JSON.stringify(data));
	}

}
