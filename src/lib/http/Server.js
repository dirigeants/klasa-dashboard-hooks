const http = require('http');
const { parse: parseURL } = require('url');
const { parse: parseQuery } = require('querystring');

const { split } = require('../util/Util');

class Server {

	constructor(client) {
		this.client = client;
		this.server = http.createServer();
		this.onNoMatch = this.onError.bind(this, { code: 404 });
	}

	listen(port, hostname) {
		this.server.on('request', this.handler.bind(this));
		return new Promise((res, rej) => {
			this.server.listen(port, hostname, err => err ? rej(err) : res());
		});
	}

	async handler(request, response) {
		const info = parseURL(request.url);
		const splitURL = split(info.pathname);
		const route = this.client.routes.find(rt => rt.matches(splitURL));

		if (route) request.params = route.execute(splitURL);
		request.originalUrl = request.originalUrl || request.url;
		request.path = info.pathname;
		request.search = info.search;
		request.query = parseQuery(info.query);

		try {
			await this.client.middlewares.run(request, response);
			const method = request.method.toLowerCase();
			await (route && method in route ? route[method](request, response) : this.onNoMatch(request, response));
		} catch (err) {
			this.onError(err, request, response);
		}
	}

	onError(err, req, res) {
		const code = res.statusCode = err.code || err.status || err.statusCode || 500;
		res.end((err.length && err) || err.message || http.STATUS_CODES[code]);
	}

}

module.exports = Server;
