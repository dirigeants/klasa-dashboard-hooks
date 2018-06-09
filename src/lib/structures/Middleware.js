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
	 * @param {KlasaIncomingMessage} request The http request
	 * @param {external:ServerResponse} response The http response
	 * @returns {void}
	 * @abstract
	 */
	async run(request, response) { // eslint-disable-line
		// Defined in extension Classes
		throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
	}

}

module.exports = Middleware;
