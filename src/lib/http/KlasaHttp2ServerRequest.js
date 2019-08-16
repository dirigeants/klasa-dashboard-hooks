const { Http2ServerRequest } = require('http2');
const { parse } = require('url');

const { split } = require('../util/Util');

/**
 * The custom class for KDH's incoming messages when using HTTP2
 * @extends external:Http2ServerRequest
 */
class KlasaHttp2ServerRequest extends Http2ServerRequest {

	/**
	 * @param {external:ServerHttp2Stream} stream The HTTP2 Server Stream
	 * @param {external:IncomingHttpHeaders} headers The incoming http headers
	 * @param {external:stream.ReadableOptions} options The stream readable options
	 * @param {string[]} rawHeaders The raw headers
	 */
	constructor(stream, headers, options, rawHeaders) {
		super(stream, headers, options, rawHeaders);

		const info = parse(this.url, true);

		/**
		 * The original url (automatic redirects)
		 * @type {string}
		 */
		this.originalUrl = this.originalUrl || this.url;

		/**
		 * The path of the url
		 * @type {string}
		 */
		this.path = info.pathname;

		/**
		 * The search string of the url
		 * @type {string}
		 */
		this.search = info.search;

		/**
		 * The parsed query of the search string
		 * @type {any}
		 */
		this.query = info.query;

		/**
		 * The parsed params from the url
		 * @type {any}
		 */
		this.params = null;

		/**
		 * The Route this incoming message is for
		 * @type {Route}
		 */
		this.route = null;

		/**
		 * Authentication Data (added in middlewares)
		 * @type {any}
		 */
		this.auth = null;

		/**
		 * Parsed data sent in a POST (added in middlewares)
		 * @type {any}
		 */
		this.body = null;
	}

	/**
	 * The lowercase method name
	 * @type {string}
	 * @readonly
	 */
	get methodLower() {
		return METHODS_LOWER[this.method];
	}

	/**
	 * Executes the Route this message is for
	 * @param {KlasaServerResponse} response The response object
	 * @returns {any}
	 */
	execute(response) {
		return this.route[this.methodLower](this, response);
	}

	/**
	 * Initializes this message for the Route
	 * @param {external:KlasaClient} client The Klasa Client
	 */
	init(client) {
		const splitURL = split(this.path);
		this.route = client.routes.findRoute(this.method, splitURL);

		if (this.route) this.params = this.route.execute(splitURL);
	}

}

module.exports = KlasaHttp2ServerRequest;

// Fixes Circular
const { METHODS_LOWER } = require('../util/constants');
