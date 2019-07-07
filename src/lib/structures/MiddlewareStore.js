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
	 * Clears the RouteStore
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		this.sortedMiddlwares = [];
		return super.clear();
	}

	/**
	 * Adds a Middleware to this MiddlewareStore
	 * @param {Middleware} piece The Middleware to add to this store
	 * @returns {Middleware}
	 */
	set(piece) {
		const middleware = super.set(piece);
		if (!middleware) return middleware;
		const index = this.sortedMiddlwares.findIndex(mid => mid.priority >= middleware.priority);
		// If a middleware with lower priority wasn't found, push to the end of the array
		if (index === -1) this.sortedMiddlwares.push(middleware);
		else this.sortedMiddlwares.splice(index, 0, middleware);
		return middleware;
	}

	/**
	 * Deletes a Middleware from this MiddlewareStore
	 * @param {Middleware|string} name The name of the Middleware or the Middleware
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
