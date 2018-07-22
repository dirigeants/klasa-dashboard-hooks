const { METHODS } = require('http');
const { Store } = require('klasa');

const Route = require('./Route');
const { METHODS_LOWER } = require('../util/constants');

/**
 * Stores all the routes that are part of Klasa-dashboard-hooks
 * @extends external:Store
 */
class RouteStore extends Store {

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'routes', Route);

		/**
		 * A lookup registry of Maps keyed on http method
		 * @since 0.0.1
		 * @type {any}
		 */
		this.registry = {};

		for (const method of METHODS) this.registry[method] = new Map();
	}

	/**
	 * Finds a route using the registry
	 * @since 0.0.1
	 * @param {string} method The http method
	 * @param {string[]} splitURL the url to find
	 * @returns {?Route}
	 */
	findRoute(method, splitURL) {
		for (const route of this.registry[method].values()) if (route.matches(splitURL)) return route;
		return undefined;
	}

	/**
	 * Clears the RouteStore
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		for (const method of METHODS) this.registry[method].clear();
		return super.clear();
	}

	/**
	 * Adds a Route to this RouteStore
	 * @param {Route} piece The route to add to this store
	 * @returns {Route}
	 */
	set(piece) {
		const route = super.set(piece);
		if (!route) return route;
		for (const method of METHODS) if (METHODS_LOWER[method] in route) this.registry[method].set(route.name, route);
		return route;
	}

	/**
	 * Deletes a Route from this RouteStore
	 * @param {Route|string} name The name of the Route or the Route
	 * @returns {boolean}
	 */
	delete(name) {
		const route = this.resolve(name);
		if (!route) return false;
		for (const method of METHODS) this.registry[method].delete(route.name);
		return super.delete(route);
	}

}

module.exports = RouteStore;
