const { Piece } = require('klasa');

/**
 * Base class for all Klasa Middleware. See {@tutorial CreatingMiddleware} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingMiddleware
 * @extends Piece
 */
class Middleware extends Piece {

	/**
	 * @since 0.0.1
	 * @param {KlasaDashboardHooksClient} client The Klasa client
	 * @param {MiddlewareStore} store The Middleware Store
	 * @param {string} file The path from the pieces folder to the middleware file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {MiddlewareOptions} [options={}] Optional Middleware settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * Stored bound run method, so it can be properly disabled and reloaded later
		 * @since 0.0.1
		 * @type {Function}
		 * @private
		 */
		this._handler = this.run.bind(this);
	}

	/**
	 * The run method to be overwritten in actual event handlers
	 * @since 0.0.1
	 * @param {PolkaRequest} request The http request
	 * @param {PolkaResponse} response The http request
	 * @param {PolkaNext} next The callback to trigger the next middleware
	 * @returns {void}
	 * @abstract
	 */
	run(request, response, next) {
		// Defined in extension Classes
		next(new Error(`The run method has not been implemented by ${this.type}:${this.name}.`));
	}

	/**
	 * Reloads this piece
	 * @since 0.0.1
	 * @returns {Piece} The newly loaded piece
	 */
	reload() {
		this.disable();
		return super.reload();
	}

	/**
	 * Disables this Middleware
	 * @since 0.0.1
	 * @returns {this}
	 * @chainable
	 */
	disable() {
		const { wares } = this.client.router;
		wares.splice(wares.indexOf(this._handler), 1);
		return super.disable();
	}

	/**
	 * Enables this Middleware
	 * @since 0.0.1
	 * @returns {this}
	 * @chainable
	 */
	enable() {
		this.client.router.wares.push(this._handler);
		return super.enable();
	}

}

module.exports = Middleware;
