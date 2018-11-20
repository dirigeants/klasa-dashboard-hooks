const http = require('http');
const { parse } = require('url');

const { split } = require('../util/Util');
const { METHODS_LOWER } = require('../util/constants');

/**
 * The http server for klasa-dashboard-hooks
 */
class Server {

	/**
	 * @typedef {Object} AuthData
	 * @property {string} token The access token
	 * @property {string[]} scope The scopes
	 */

	/**
	 * @typedef {external:IncomingMessage} KlasaIncomingMessage
	 * @property {string} originalUrl The original URL
	 * @property {string} path The entire path section of the URL, including the `host`, `port`... and before the `query`/`hash` components
	 * @property {string} search The entire query string portion of the URL including the leading ASCII question mark (`?`) character
	 * @property {Object<string, *>} query The collection of key and value pairs parsed from the query string portion
	 * @property {any} [body] The body parsed in POST requests
	 * @property {AuthData} [auth] The auth access token and scopes
	 */

	/**
	 * @typedef {Object} ErrorLike
	 * @property {number} [code]
	 * @property {number} [status]
	 * @property {number} [statusCode]
	 * @property {string} [message]
	 * @private
	 */

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The Klasa client
	 */
	constructor(client) {
		const { http2, sslOptions } = client.options.dashboardHooks;
		/**
		 * The Client that manages this Server instance
		 * @since 0.0.1
		 * @type {DashboardClient}
		 */
		this.client = client;

		/**
		 * The http.Server instance that manages the HTTP requests
		 * @since 0.0.1
		 * @type {external:HTTPServer}
		 */
		this.server = http2 ?
			require('http2').createSecureServer(sslOptions) :
			sslOptions ? require('https').createServer(sslOptions) : http.createServer();

		/**
		 * The onError function called when a url does not match
		 * @since 0.0.1
		 * @type {Function}
		 */
		this.onNoMatch = this.onError.bind(this, { code: 404 });
	}

	/**
	 * Starts the server listening to a port
	 * @param {number} port The port to run the server on
	 * @returns {Promise<void>}
	 */
	listen(port) {
		this.server.on('request', this.handler.bind(this));
		return new Promise((res, rej) => {
			this.server.listen(port, err => err ? rej(err) : res());
		});
	}

	/**
	 * The handler for incoming requests
	 * @param {external:IncomingMessage} request The request
	 * @param {external:ServerResponse} response The response
	 */
	async handler(request, response) {
		const info = parse(request.url, true);
		const splitURL = split(info.pathname);
		const route = this.client.routes.findRoute(request.method, splitURL);

		if (route) request.params = route.execute(splitURL);
		request.originalUrl = request.originalUrl || request.url;
		request.path = info.pathname;
		request.search = info.search;
		request.query = info.query;

		try {
			await this.client.middlewares.run(request, response, route);
			await (route ? route[METHODS_LOWER[request.method]](request, response) : this.onNoMatch(request, response));
		} catch (err) {
			this.client.emit('error', err);
			this.onError(err, request, response);
		}
	}

	/**
	 * The handler for errors
	 * @param {(Error|ErrorLike)} error The error
	 * @param {KlasaIncomingMessage} request The request
	 * @param {external:ServerResponse} response The response
	 */
	onError(error, request, response) {
		const code = response.statusCode = error.code || error.status || error.statusCode || 500;
		response.end((error.length && error) || error.message || http.STATUS_CODES[code]);
	}

}

module.exports = Server;
