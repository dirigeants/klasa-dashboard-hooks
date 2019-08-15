const { Http2ServerResponse } = require('http2');

/**
 * The server response for KDH when using HTTP2
 * @extends external:Http2ServerResponse
 */
class KlasaHttp2ServerResponse extends Http2ServerResponse {

	/**
	 * Sets the status code of this response
	 * @param {number} code The status code to set the response to
	 * @returns {this}
	 */
	status(code) {
		this.statusCode = code;
		return this;
	}

	/**
	 * Ends the response with JSON.stringified data
	 * @param {any} data The data to respond with
	 * @returns {any}
	 */
	json(data) {
		return this.end(JSON.stringify(data));
	}

}

module.exports = KlasaHttp2ServerResponse;
