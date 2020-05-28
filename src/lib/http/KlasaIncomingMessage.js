const { IncomingMessage } = require('http');
const { parse } = require('url');

const { split } = require('../util/Util');

/**
 * The custom class for KDH's incoming messages when using HTTP/HTTPS
 * @extends external:IncomingMessage
 */
class KlasaIncomingMessage extends IncomingMessage {

	/**
	 * @param {external:Socket} socket The net.Socket
	 */
	constructor(socket) {
		super(socket);

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
		// this.url is '' in the constructor and is updated later
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

// Fixes circular
const { METHODS_LOWER } = require('../util/constants');
