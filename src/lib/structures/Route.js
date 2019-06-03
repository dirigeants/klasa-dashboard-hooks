const { Piece } = require('klasa');

const { parse } = require('../util/Util');

/**
 * Base class for all Klasa Routes. See {@tutorial CreatingRoutes} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingRoutes
 * @extends external:Piece
 */
class Route extends Piece {

	/**
	 * @typedef {ParsedPart[]} ParsedRoute
	 */

	/**
	 * @typedef {external:PieceOptions} RouteOptions
	 * @property {string} [route]
	 */

	/**
	 * @since 0.0.1
	 * @param {RouteStore} store The Route Store
	 * @param {string} file The path from the pieces folder to the route file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {RouteOptions} [options={}] Optional Route settings
	 */
	constructor(store, file, core, options = {}) {
		super(store, file, core, options);

		/**
		 * Stored bound run method, so it can be properly disabled and reloaded later
		 * @since 0.0.1
		 * @type {string}
		 */
		this.route = this.client.options.dashboardHooks.apiPrefix + options.route;

		/**
		 * If the route is authenticated
		 * @since 0.0.1
		 * @type {string}
		 */
		this.authenticated = options.authenticated;

		/**
		 * Stored parsed route
		 * @since 0.0.1
		 * @type {ParsedRoute}
		 */
		this.parsed = parse(this.route);
	}

	/**
	 * If this route matches a provided url
	 * @param {string[]} split the url to check
	 * @returns {boolean}
	 */
	matches(split) {
		if (split.length !== this.parsed.length) return false;
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
		return true;
	}

	/**
	 * Extracts the params from a provided url
	 * @param {string[]} split the url
	 * @returns {Object<string, *>}
	 */
	execute(split) {
		const params = {};
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 1) params[this.parsed[i].val] = split[i];
		return params;
	}

}

module.exports = Route;
