module.exports = {
	Client: require('./lib/Client'),
	Middleware: require('./lib/structures/Middleware'),
	MiddlewareStore: require('./lib/structures/MiddlewareStore'),
	Route: require('./lib/structures/Route'),
	RouteStore: require('./lib/structures/RouteStore'),
	constants: require('./lib/util/constants'),
	util: require('./lib/util/util'),
	Util: require('./lib/util/util')
};

/**
 * @external KlasaClient
 * @see {@link https://klasa.js.org/#/docs/main/master/class/KlasaClient}
 */
/**
 * @external Piece
 * @see {@link https://klasa.js.org/#/docs/main/master/class/Piece}
 */
/**
 * @external Store
 * @see {@link https://klasa.js.org/#/docs/main/master/class/Store}
 */
/**
 * @external KlasaClientOptions
 * @see {@link https://klasa.js.org/#/docs/main/master/typedef/KlasaClientOptions}
 */
/**
 * @external Polka
 * @see {@link https://github.com/lukeed/polka/tree/master/packages/polka}
 */