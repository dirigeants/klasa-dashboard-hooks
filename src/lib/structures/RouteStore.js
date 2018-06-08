const { join } = require('path');
const { Store } = require('klasa');

const Route = require('./Route');

/**
 * Stores all the routes that are part of Klasa-dashboard-hooks
 * @extends external:Store
 */
class RouteStore extends Store {

	constructor(client) {
		super(client, 'routes', Route);
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
	 * Clears the routes from the store and removes the listeners.
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		for (const event of this.values()) this.delete(event);
	}

	/**
	 * Deletes an routes from the store.
	 * @since 0.0.1
	 * @param {Route|string} name An route object or a string representing the event name.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const route = this.resolve(name);
		if (!route) return false;
		route.disable();
		return super.delete(route);
	}

	/**
	 * Sets up an route in our store.
	 * @since 0.0.1
	 * @param {Route} piece The route piece we are setting up
	 * @returns {?Route}
	 */
	set(piece) {
		const route = super.set(piece);
		if (!route) return undefined;
		route.enable();
		return route;
	}

}

module.exports = RouteStore;
