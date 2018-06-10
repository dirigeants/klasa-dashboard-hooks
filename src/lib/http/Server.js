const http = require('http');
const { parse } = require('url');

const { split } = require('../util/Util');

/**
 * The http server for klasa-dashboard-hooks
 */
class Server {

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The Klasa client
	 */
	constructor(client) {
		const { http2 = false, sslOptions } = client.options.dashboardHooks;
		this.client = client;
		this.server = http2 ?
			require('http2').createSecureServer(sslOptions) :
			sslOptions ? require('https').createServer(sslOptions) : http.createServer();
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
	 * @param {HttpRequest} request The request
	 * @param {HttpResponse} response The response
	 */
	async handler(request, response) {
		const info = parse(request.url, true);
		const splitURL = split(info.pathname);
		const route = this.client.routes.find(rt => rt.matches(splitURL));

		if (route) request.params = route.execute(splitURL);
		request.originalUrl = request.originalUrl || request.url;
		request.path = info.pathname;
		request.search = info.search;
		request.query = info.query;

		try {
			await this.client.middlewares.run(request, response, route);
			const method = request.method.toLowerCase();
			await (route && method in route ? route[method](request, response) : this.onNoMatch(request, response));
		} catch (err) {
			this.onError(err, request, response);
		}
	}

	/**
	 * The handler for errors
	 * @param {Error|any} error The error
	 * @param {HttpRequest} request The request
	 * @param {HttpResponse} response The response
	 */
	onError(error, request, response) {
		const code = response.statusCode = error.code || error.status || error.statusCode || 500;
		response.end((error.length && error) || error.message || http.STATUS_CODES[code]);
	}

}

module.exports = Server;
