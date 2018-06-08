const { join } = require('path');
const { Store } = require('klasa');

const Route = require('./Route');

/**
 * Stores all the routes that are part of Klasa-dashboard-hooks
 * @extends Store
 */
class RouteStore extends Store {

	constructor(client) {
		super(client, 'routes', Route);
	}

	/**
	 * The directory of commands in Klasa relative to where its installed.
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get coreDir() {
		return join(this.client.hookBaseDir, this.name);
	}

	/**
	 * Clears the events from the store and removes the listeners.
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		for (const event of this.values()) this.delete(event);
	}

	/**
	 * Deletes an event from the store.
	 * @since 0.0.1
	 * @param {Event|string} name An event object or a string representing the event name.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const route = this.resolve(name);
		if (!route) return false;
		route.disable();
		return super.delete(route);
	}

	/**
	 * Sets up an event in our store.
	 * @since 0.0.1
	 * @param {Event} piece The event piece we are setting up
	 * @returns {?Event}
	 */
	set(piece) {
		const route = super.set(piece);
		if (!route) return undefined;
		route.enable();
		return route;
	}

}

module.exports = RouteStore;
