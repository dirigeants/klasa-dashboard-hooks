const { join } = require('path');
const { Store } = require('klasa');

const Route = require('./Route');

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

}

module.exports = RouteStore;
