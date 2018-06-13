const { Client, util: { mergeDefault } } = require('klasa');

const Server = require('./http/Server');
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
	 * @property {boolean} [http2=false] Whether the server should use http/2 or not
	 * @property {external:SecureContextOptions} [sslOptions] The SSL options
	 */

	/**
	 * Constructs the klasa-dashboard-hooks client
	 * @since 0.0.1
	 * @param {DashboardClientOptions} config The config to pass to the new client
	 */
	constructor(config) {
		super(config);
		this.constructor[Client.plugin].call(this);
	}

	static [Client.plugin]() {
		mergeDefault(OPTIONS, this.options);

		/**
		 * The http server handler for the api
		 * @since 0.0.1
		 * @type {Server}
		 */
		this.server = new Server(this);

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
			.registerStore(this.routes)
			.registerStore(this.middlewares);

		this.server.listen(this.options.dashboardHooks.port);
	}

}

module.exports = DashboardClient;
