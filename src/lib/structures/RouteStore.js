const { join } = require('path');
const { Store } = require('klasa');
const Polka = require('polka')().constructor;
// Fuck polka for this export, btw

const Route = require('./Route');

class RouteStore extends Store {

	constructor(client) {
		super(client, 'routes', Route);

		this.router = new Polka(this.client.options.something);

		this.router.listen(this.client.options.dashboardHooks.port);
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

}

module.exports = RouteStore;
