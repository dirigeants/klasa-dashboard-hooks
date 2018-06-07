const { join } = require('path');

const { Client, util: { mergeDefault } } = require('klasa');

const RouteStore = require('./structures/RouteStore');
const { OPTIONS } = require('./util/constants');

class DashboardClient extends Client {

	constructor(...args) {
		super(...args);

		mergeDefault(this.options, OPTIONS);

		/**
		 * The directory to the node_modules folder where Klasa exists
		 * @since 0.0.1
		 * @type {string}
		 */
		this.hooksBaseDir = join(__dirname, '../');

		this.routes = new RouteStore(this);

		this.registerStore('routes', this.routes);
	}

}

module.exports = DashboardClient;
