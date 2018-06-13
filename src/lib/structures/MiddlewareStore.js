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

		/**
		 * The middlewares sorted by priority
		 * @type {Middleware[]}
		 */
		this.sortedMiddlwares = [];
	}

	/**
	 * The directory of pieces in Klasa relative to where its installed.
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get coreDir() {
		return join(__dirname, '../../', this.name);
	}

	/**
	 * Clears the RouteStore
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		this.sortedMiddlwares = [];
		return super.clear();
	}

	/**
	 * Adds a Route to this RouteStore
	 * @param {Route} piece The route to add to this store
	 * @returns {Route}
	 */
	set(piece) {
		const middleware = super.set(piece);
		if (!middleware) return middleware;
		this.sortedMiddlwares.splice(this.sortedMiddlwares.findIndex(mid => mid.priority >= middleware.priority) - 1, 0, middleware);
		return middleware;
	}

	/**
	 * Deletes a Route from this RouteStore
	 * @param {Route|string} name The Name of the Route or the Route
	 * @returns {boolean}
	 */
	delete(name) {
		const middleware = this.resolve(name);
		if (!middleware) return false;
		this.sortedMiddlwares.splice(this.sortedMiddlwares.indexOf(middleware), 1);
		return super.delete(middleware);
	}

	/**
	 * Runs all the middleware.
	 * @since 0.0.1
	 * @param {KlasaIncomingMessage} request The http request
	 * @param {external:ServerResponse} response The http response
	 * @param {?Route} route The route being run
	 * @returns {void}
	 */
	async run(request, response, route) {
		for (const middleware of this.sortedMiddlwares) {
			if (response.finished) return;
			if (middleware.enabled) await middleware.run(request, response, route);
		}
	}

}

module.exports = MiddlewareStore;
