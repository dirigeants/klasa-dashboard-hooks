const httpmethods = require('http').METHODS.map(str => str.toLowerCase());
const { Piece } = require('klasa');
const { parse } = require('matchit');

/**
 * Base class for all Klasa Routes. See {@tutorial CreatingRoutes} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingRoutes
 * @extends external:Piece
 */
class Route extends Piece {

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The Klasa client
	 * @param {RouteStore} store The Route Store
	 * @param {string} file The path from the pieces folder to the middleware file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {RouteOptions} [options={}] Optional Route settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * Stored bound run method, so it can be properly disabled and reloaded later
		 * @since 0.0.1
		 * @type {string}
		 */
		this.route = this.client.options.dashboardHooks.apiPrefix + options.route;
	}

	/**
	 * Reloads this route
	 * @since 0.0.1
	 * @returns {Route} The newly loaded route
	 */
	reload() {
		this.disable();
		return super.reload();
	}

	/**
	 * Disables this Route
	 * @since 0.0.1
	 * @returns {this}
	 * @chainable
	 */
	disable() {
		const { routes, handlers } = this.client.router;
		for (const [method, route] of Object.entries(routes)) {
			const index = route.findIndex(rt => rt[0].old === this.route);
			if (index === -1) continue;
			route.splice(index, 1);
			delete handlers[method][this.route];
		}
		return super.disable();
	}

	/**
	 * Enables this Route
	 * @since 0.0.1
	 * @returns {this}
	 * @chainable
	 */
	enable() {
		const { routes, handlers } = this.client.router;
		for (const method of httpmethods) {
			if (!this[method]) continue;
			// Save decoded pattern info
			if (!routes[method]) routes[method] = [];
			routes[method].push(parse(this.route));
			// Save route handler
			if (!handlers[method]) handlers[method] = {};
			this.handlers[method][this.route] = this[method].bind(this);
		}
		return super.enable();
	}

}

module.exports = Route;
