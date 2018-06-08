const { join } = require('path');

const { Client, util: { mergeDefault } } = require('klasa');
const Polka = require('polka')().constructor;
// Fuck polka for this export, btw

const RouteStore = require('./structures/RouteStore');
const MiddlewareStore = require('./structures/MiddlewareStore');
const { OPTIONS } = require('./util/constants');

/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @extends external:KlasaClient
 * @tutorial GettingStarted
 */
class DashboardClient extends Client {


	/**
	 * @typedef {external:KlasaClientOptions} DashboardClientOptions
	 * @property {KlasaDashboardHooksOptions} [dashboardHooks] The Klasa-Dashboard-Hooks specific options
	 */

	/**
	 * @typedef {Object} KlasaDashboardHooksOptions
	 * @property {string} [apiPrefix="api/"] The route prefix for the api
	 * @property {string} [origin="*"] The cross origin setting
	 * @property {number} [port=4000] The port the api runs on
	 */

	/**
	 * Constructs the klasa-dashboard-hooks client
	 * @since 0.0.1
	 * @param {DashboardClientOptions} config The config to pass to the new client
	 */
	constructor(config) {
		super(config);
		mergeDefault(this.options, OPTIONS);

		/**
		 * The directory to the node_modules folder where Klasa-Dashboard-Hooks exists
		 * @since 0.0.1
		 * @type {string}
		 */
		this.hooksBaseDir = join(__dirname, '../');

		/**
		 * The directory to the node_modules folder where Klasa-Dashboard-Hooks exists
		 * @since 0.0.1
		 * @type {external:Polka}
		 */
		this.router = new Polka(this.options.dashboardHooks.something);

		/**
		 * The cache where routes are stored
		 * @since 0.0.1
		 * @type {RouteStore}
		 */
		this.routes = new RouteStore(this);

		/**
		 * The cache where middlewares are stored
		 * @since 0.0.1
		 * @type {MiddlewareStore}
		 */
		this.middlewares = new MiddlewareStore(this);

		this
			.registerStore('routes', this.routes)
			.registerStore('middlewares', this.middlewares);

		this.router.listen(this.options.dashboardHooks.port);
	}

}

module.exports = DashboardClient;
