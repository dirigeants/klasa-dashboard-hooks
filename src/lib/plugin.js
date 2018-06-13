const { util: { mergeDefault } } = require('klasa');

const Server = require('./http/Server');
const RouteStore = require('./structures/RouteStore');
const MiddlewareStore = require('./structures/MiddlewareStore');
const { OPTIONS } = require('./util/constants');

module.exports = function plugin() {
	mergeDefault(OPTIONS, this.options);
	this.server = new Server(this);
	this.routes = new RouteStore(this);
	this.middlewares = new MiddlewareStore(this);
	this
		.registerStore(this.routes)
		.registerStore(this.middlewares);
	this.server.listen(this.options.dashboardHooks.port);
};
