const { Piece } = require('klasa');

/**
 * Base class for all Klasa Middleware. See {@tutorial CreatingMiddlewares} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingMiddlewares
 * @extends external:Piece
 */
class Middleware extends Piece {


	/**
	 * @typedef {external:PieceOptions} RouteOptions
	 * @property {number} [priority]
	 */

	/**
	 * @since 0.0.1
	 * @param {MiddlewareStore} store The Middleware Store
	 * @param {string} file The path from the pieces folder to the middleware file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {MiddlewareOptions} [options={}] Optional Middleware settings
	 */
	constructor(store, file, core, options = {}) {
		super(store, file, core, options);

		/**
		 * The priority in which this middleware should run
		 * @since 0.0.1
		 * @type {number}
		 */
		this.priority = options.priority;
	}

	/**
	 * The run method to be overwritten in actual event handlers
	 * @since 0.0.1
	 * @param {KlasaIncomingMessage} request The http request
	 * @param {external:ServerResponse} response The http response
	 * @param {?Route} route The route being run
	 * @returns {void}
	 * @abstract
	 */
	async run(request, response, route) { // eslint-disable-line
		// Defined in extension Classes
		throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
	}

}

module.exports = Middleware;
