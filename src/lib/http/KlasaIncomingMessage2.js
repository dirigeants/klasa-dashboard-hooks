const { Http2ServerRequest } = require('http2');
const { parse } = require('url');

const { split } = require('../util/Util');

/**
 * The custom class for KDH's incoming messages when using HTTP2
 * @extends external:Http2ServerRequest
 */
class KlasaIncomingMessage extends Http2ServerRequest {

	/**
	 * @param {external:ServerHttp2Stream} stream The HTTP2 Server Stream
	 * @param {external:IncomingHttpHeaders} headers The incoming http headers
	 * @param {external:stream.ReadableOptions} options The stream readable options
	 * @param {string[]} rawHeaders The raw headers
	 */
	constructor(stream, headers, options, rawHeaders) {
		super(stream, headers, options, rawHeaders);

		/**
		 * The original url (automatic redirects)
		 * @type {string}
		 */
		this.originalUrl = null;

		/**
		 * The path of the url
		 * @type {string}
		 */
		this.path = null;

		/**
		 * The search string of the url
		 * @type {string}
		 */
		this.search = null;

		/**
		 * The parsed query of the search string
		 * @type {any}
		 */
		this.query = null;

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
		const info = parse(this.url, true);
		this.originalUrl = this.originalUrl || this.url;
		this.path = info.pathname;
		this.search = info.search;
		this.query = info.query;

		const splitURL = split(this.path);
		this.route = client.routes.findRoute(this.method, splitURL);

		if (this.route) this.params = this.route.execute(splitURL);
	}

}

module.exports = KlasaIncomingMessage;

// Fixes Circular
const { METHODS_LOWER } = require('../util/constants');
