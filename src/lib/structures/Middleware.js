const { Piece } = require('klasa');

/**
 * Base class for all Klasa Middleware. See {@tutorial CreatingMiddlewares} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingMiddlewares
 * @extends external:Piece
 */
class Middleware extends Piece {

	/**
	 * The run method to be overwritten in actual event handlers
	 * @since 0.0.1
	 * @param {HttpRequest} request The http request
	 * @param {HttpResponse} response The http response
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
