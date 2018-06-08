const { join } = require('path');
const { Store } = require('klasa');

const Middleware = require('./Middleware');

/**
 * Stores all the middlewares that are part of Klasa-dashboard-hooks
 * @extends Store
 */
class MiddlewareStore extends Store {

	/**
	 * @since 0.0.1
	 * @param {KlasaDashboardHooksClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'routes', Middleware);
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
		const middleware = this.resolve(name);
		if (!middleware) return false;
		middleware.disable();
		return super.delete(middleware);
	}

	/**
	 * Sets up an event in our store.
	 * @since 0.0.1
	 * @param {Event} piece The event piece we are setting up
	 * @returns {?Event}
	 */
	set(piece) {
		const middleware = super.set(piece);
		if (!middleware) return undefined;
		middleware.enable();
		return middleware;
	}

}

module.exports = MiddlewareStore;
