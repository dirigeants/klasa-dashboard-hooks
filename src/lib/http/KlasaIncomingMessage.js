const { IncomingMessage } = require('http');
const { parse } = require('url');

const { METHODS_LOWER } = require('../util/constants');
const { split } = require('../util/Util');

class KlasaIncomingMessage extends IncomingMessage {

	constructor(socket) {
		super(socket);

		const info = parse(this.url, true);

		this.originalUrl = this.originalUrl || this.url;
		this.path = info.pathname;
		this.search = info.search;
		this.query = info.query;

		this.params = null;
		this.route = null;
	}

	get methodLower() {
		return METHODS_LOWER[this.method];
	}

	execute(request, response) {
		return this.route[this.methodLower](request, response);
	}

	init(client) {
		const splitURL = split(this.path);
		this.route = client.routes.findRoute(this.method, splitURL);

		if (this.route) this.params = this.route.execute(splitURL);
	}

}

module.exports = KlasaIncomingMessage;
