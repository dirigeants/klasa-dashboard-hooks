const { Http2ServerRequest } = require('http2');
const { parse } = require('url');

const { METHODS_LOWER } = require('../util/constants');
const { split } = require('../util/Util');

/**
 * The custom class for KDH's incoming messages when using HTTP2
 * @extends external:Http2ServerRequest
 */
class KlasaIncomingMessage extends Http2ServerRequest {

	/**
	 * @param {external:Socket} socket The net.Socket
	 */
	constructor(socket) {
		super(socket);

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
		 * The parsed queury of the search string
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

module.exports = KlasaIncomingMessage;
