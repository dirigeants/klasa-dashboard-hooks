const { join } = require('path');
const { Store } = require('klasa');

const Middleware = require('./Middleware');

/**
 * Stores all the middlewares that are part of Klasa-dashboard-hooks
 * @extends external:Store
 */
class MiddlewareStore extends Store {

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'middlewares', Middleware);
	}

	/**
	 * The directory of pieces in Klasa relative to where its installed.
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get coreDir() {
		return join(this.client.hooksBaseDir, this.name);
	}

	/**
	 * Runs all the middleware.
	 * @since 0.0.1
	 * @param {KlasaIncomingMessage} request The http request
	 * @param {external:ServerResponse} response The http response
	 * @returns {void}
	 */
	async run(request, response) {
		for (const middleware of this.values()) {
			if (response.finished) return;
			if (middleware.enabled) await middleware.run(request, response);
		}
	}

}

module.exports = MiddlewareStore;
